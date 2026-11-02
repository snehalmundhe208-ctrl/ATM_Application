import bcrypt from 'bcryptjs';
import prisma from '../services/prisma.js';
import { createSession, endSession } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { cardNumber, pin } = req.body;
    const targetCardNumber = cardNumber ? cardNumber.toString().trim() : '1234567890123456';

    if (!pin || pin.toString().length !== 4 || !/^\d{4}$/.test(pin.toString())) {
      return res.status(400).json({
        success: false,
        error: 'PIN must be exactly 4 numeric digits.',
        code: 'INVALID_PIN_FORMAT',
      });
    }

    const account = await prisma.account.findUnique({
      where: { accountNumber: targetCardNumber },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account / Card number not recognized by SecureBank.',
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    // Check lock status
    if (account.isLocked) {
      if (account.lockedUntil && new Date() > new Date(account.lockedUntil)) {
        // Automatically unlock after lock period expires
        await prisma.account.update({
          where: { id: account.id },
          data: { isLocked: false, failedAttempts: 0, lockedUntil: null, status: 'ACTIVE' },
        });
      } else {
        const remainingMinutes = account.lockedUntil
          ? Math.ceil((new Date(account.lockedUntil).getTime() - Date.now()) / 60000)
          : 5;
        return res.status(423).json({
          success: false,
          error: `Card has been locked due to 3 consecutive failed PIN attempts. Please wait ${remainingMinutes} minute(s) or reset via the SET Testing Panel.`,
          code: 'ACCOUNT_LOCKED',
          failedAttempts: account.failedAttempts,
          lockedUntil: account.lockedUntil,
        });
      }
    }

    // Verify PIN
    const isMatch = await bcrypt.compare(pin.toString(), account.pinHash);

    if (!isMatch) {
      const newAttempts = account.failedAttempts + 1;
      const willLock = newAttempts >= 3;
      const lockedUntil = willLock ? new Date(Date.now() + 5 * 60 * 1000) : null;

      await prisma.account.update({
        where: { id: account.id },
        data: {
          failedAttempts: newAttempts,
          isLocked: willLock,
          lockedUntil: lockedUntil,
          status: willLock ? 'LOCKED' : account.status,
        },
      });

      if (willLock) {
        return res.status(423).json({
          success: false,
          error: 'Maximum PIN attempts exceeded (3/3). Your card has been temporarily locked for security.',
          code: 'ACCOUNT_LOCKED',
          failedAttempts: 3,
          lockedUntil,
        });
      }

      const attemptsRemaining = 3 - newAttempts;
      return res.status(401).json({
        success: false,
        error: `Incorrect PIN. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining before card lockout.`,
        code: 'INVALID_PIN',
        attemptsRemaining,
        failedAttempts: newAttempts,
      });
    }

    // PIN is correct - Reset failed attempts & generate session
    await prisma.account.update({
      where: { id: account.id },
      data: {
        failedAttempts: 0,
        isLocked: false,
        lockedUntil: null,
        status: 'ACTIVE',
      },
    });

    const sessionToken = createSession(account.accountNumber);

    res.json({
      success: true,
      message: 'Authentication successful. Welcome to SecureBank ATM.',
      sessionToken,
      account: {
        accountNumber: account.accountNumber,
        cardHolder: account.cardHolder,
        accountType: account.accountType,
        balance: account.balance,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred during PIN verification.',
    });
  }
};

export const changePin = async (req, res) => {
  try {
    const { currentPin, newPin, confirmPin } = req.body;
    const account = req.account;

    if (!currentPin || !newPin || !confirmPin) {
      return res.status(400).json({
        success: false,
        error: 'Current PIN, New PIN, and Confirmation PIN are all required.',
        code: 'MISSING_FIELDS',
      });
    }

    // Check current PIN
    const isCurrentValid = await bcrypt.compare(currentPin.toString(), account.pinHash);
    if (!isCurrentValid) {
      return res.status(401).json({
        success: false,
        error: 'Current PIN verification failed. Incorrect current PIN entered.',
        code: 'INCORRECT_CURRENT_PIN',
      });
    }

    // Validate new PIN format
    if (!/^\d{4}$/.test(newPin.toString())) {
      return res.status(400).json({
        success: false,
        error: 'New PIN must be exactly 4 numeric digits.',
        code: 'INVALID_PIN_FORMAT',
      });
    }

    // Validate match
    if (newPin.toString() !== confirmPin.toString()) {
      return res.status(400).json({
        success: false,
        error: 'New PIN and Confirmation PIN do not match.',
        code: 'PIN_MISMATCH',
      });
    }

    // Cannot be same as current PIN
    if (currentPin.toString() === newPin.toString()) {
      return res.status(400).json({
        success: false,
        error: 'New PIN cannot be the same as your current PIN. Please select a different 4-digit combination.',
        code: 'SAME_PIN',
      });
    }

    // Hash and update
    const hashedNewPin = await bcrypt.hash(newPin.toString(), 10);
    const updatedAccount = await prisma.account.update({
      where: { id: account.id },
      data: { pinHash: hashedNewPin },
    });

    // Record PIN change transaction audit
    const ref = `PIN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    await prisma.transaction.create({
      data: {
        referenceNumber: ref,
        type: 'PIN_CHANGE',
        amount: 0,
        balanceAfter: updatedAccount.balance,
        status: 'SUCCESS',
        description: 'ATM PIN successfully updated and hashed',
        senderAccountId: account.id,
        senderAccountNumber: account.accountNumber,
      },
    });

    res.json({
      success: true,
      message: 'Your ATM PIN has been updated successfully. Use your new PIN for future transactions.',
      referenceNumber: ref,
    });
  } catch (error) {
    console.error('Change PIN error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while updating the PIN.',
    });
  }
};

export const logout = (req, res) => {
  endSession(req.sessionToken);
  res.json({
    success: true,
    message: 'ATM session terminated. Card ejected safely.',
  });
};

export const unlockAccount = async (req, res) => {
  try {
    const { cardNumber } = req.body;
    const target = cardNumber || '1234567890123456';
    await prisma.account.update({
      where: { accountNumber: target },
      data: {
        failedAttempts: 0,
        isLocked: false,
        lockedUntil: null,
        status: 'ACTIVE',
      },
    });
    res.json({
      success: true,
      message: `Account ${target} has been successfully unlocked.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
