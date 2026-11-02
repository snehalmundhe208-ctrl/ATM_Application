import prisma from '../services/prisma.js';

function generateReference(prefix) {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${dateStr}-${randomPart}`;
}

export const withdraw = async (req, res) => {
  try {
    const rawAmount = req.body.amount;
    const amount = Number(rawAmount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid withdrawal amount. Amount must be a positive number greater than ₹0.',
        code: 'INVALID_AMOUNT',
      });
    }

    if (amount % 100 !== 0) {
      return res.status(400).json({
        success: false,
        error: 'ATM can only dispense in multiples of ₹100, ₹200, or ₹500 notes.',
        code: 'INVALID_DENOMINATION',
      });
    }

    if (amount > 40000) {
      return res.status(400).json({
        success: false,
        error: 'Single transaction limit exceeded. Maximum ATM cash withdrawal is ₹40,000.',
        code: 'LIMIT_EXCEEDED',
      });
    }

    const accountId = req.account.id;

    // Execute atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // Re-fetch account inside transaction for concurrency safety
      const currentAccount = await tx.account.findUnique({
        where: { id: accountId },
      });

      if (!currentAccount) {
        throw { status: 404, message: 'Account not found.' };
      }

      if (currentAccount.balance < amount) {
        throw {
          status: 400,
          code: 'INSUFFICIENT_FUNDS',
          message: `Insufficient funds. Your available balance is ₹${currentAccount.balance.toLocaleString('en-IN')}, which is less than requested ₹${amount.toLocaleString('en-IN')}.`,
        };
      }

      const updatedBalance = currentAccount.balance - amount;

      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: { balance: updatedBalance },
      });

      const refNum = generateReference('WTH');

      const transaction = await tx.transaction.create({
        data: {
          referenceNumber: refNum,
          type: 'WITHDRAWAL',
          amount: amount,
          balanceAfter: updatedBalance,
          status: 'SUCCESS',
          description: `Cash Dispensed at ATM (${amount >= 2000 ? '₹500 & ₹200 notes' : '₹500 & ₹100 notes'})`,
          terminalId: 'ATM-BLR-042',
          senderAccountId: currentAccount.id,
          senderAccountNumber: currentAccount.accountNumber,
        },
      });

      return { updatedAccount, transaction };
    });

    res.json({
      success: true,
      message: 'Cash dispensed successfully. Please collect your cash from the dispenser tray.',
      receipt: {
        referenceNumber: result.transaction.referenceNumber,
        type: 'WITHDRAWAL',
        amount: result.transaction.amount,
        balanceAfter: result.updatedAccount.balance,
        date: result.transaction.createdAt,
        terminalId: result.transaction.terminalId,
        cardHolder: result.updatedAccount.cardHolder,
        accountNumber: result.updatedAccount.accountNumber,
        status: result.transaction.status,
      },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        error: error.message,
        code: error.code || 'BAD_REQUEST',
      });
    }
    console.error('Withdrawal error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing cash withdrawal.',
    });
  }
};

export const deposit = async (req, res) => {
  try {
    const rawAmount = req.body.amount;
    const amount = Number(rawAmount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid deposit amount. Amount must be a positive number greater than ₹0.',
        code: 'INVALID_AMOUNT',
      });
    }

    if (amount > 200000) {
      return res.status(400).json({
        success: false,
        error: 'Single deposit limit exceeded. Maximum instant deposit per session is ₹2,00,000.',
        code: 'LIMIT_EXCEEDED',
      });
    }

    const accountId = req.account.id;

    const result = await prisma.$transaction(async (tx) => {
      const currentAccount = await tx.account.findUnique({
        where: { id: accountId },
      });

      if (!currentAccount) {
        throw { status: 404, message: 'Account not found.' };
      }

      const updatedBalance = currentAccount.balance + amount;

      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: { balance: updatedBalance },
      });

      const refNum = generateReference('DEP');

      const transaction = await tx.transaction.create({
        data: {
          referenceNumber: refNum,
          type: 'DEPOSIT',
          amount: amount,
          balanceAfter: updatedBalance,
          status: 'SUCCESS',
          description: 'Instant Cash Deposit into Account',
          terminalId: 'ATM-BLR-042',
          senderAccountId: currentAccount.id,
          senderAccountNumber: currentAccount.accountNumber,
        },
      });

      return { updatedAccount, transaction };
    });

    res.json({
      success: true,
      message: 'Deposit successful. Your account has been credited immediately.',
      receipt: {
        referenceNumber: result.transaction.referenceNumber,
        type: 'DEPOSIT',
        amount: result.transaction.amount,
        balanceAfter: result.updatedAccount.balance,
        date: result.transaction.createdAt,
        terminalId: result.transaction.terminalId,
        cardHolder: result.updatedAccount.cardHolder,
        accountNumber: result.updatedAccount.accountNumber,
        status: result.transaction.status,
      },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        error: error.message,
        code: error.code || 'BAD_REQUEST',
      });
    }
    console.error('Deposit error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing cash deposit.',
    });
  }
};

export const transfer = async (req, res) => {
  try {
    const { recipientAccountNumber, note } = req.body;
    const rawAmount = req.body.amount;
    const amount = Number(rawAmount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transfer amount. Amount must be a positive number greater than ₹0.',
        code: 'INVALID_AMOUNT',
      });
    }

    if (!recipientAccountNumber || recipientAccountNumber.toString().trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Recipient account number is required.',
        code: 'MISSING_RECIPIENT',
      });
    }

    const cleanRecipientAcc = recipientAccountNumber.toString().trim();

    // Prevent transferring to self
    if (cleanRecipientAcc === req.account.accountNumber) {
      return res.status(400).json({
        success: false,
        error: 'Self-transfer is not permitted. Recipient account cannot be the same as your account number.',
        code: 'SELF_TRANSFER_NOT_ALLOWED',
      });
    }

    // Check if recipient exists in Recipients table or Accounts table
    const [recipientBeneficiary, targetAccount] = await Promise.all([
      prisma.recipient.findUnique({ where: { accountNumber: cleanRecipientAcc } }),
      prisma.account.findUnique({ where: { accountNumber: cleanRecipientAcc } }),
    ]);

    if (!recipientBeneficiary && !targetAccount) {
      return res.status(404).json({
        success: false,
        error: `Beneficiary account (${cleanRecipientAcc}) not found. Please verify the account number or select from predefined beneficiaries.`,
        code: 'RECIPIENT_NOT_FOUND',
      });
    }

    const recipientName = recipientBeneficiary
      ? recipientBeneficiary.name
      : targetAccount.cardHolder;

    const accountId = req.account.id;

    const result = await prisma.$transaction(async (tx) => {
      const sender = await tx.account.findUnique({
        where: { id: accountId },
      });

      if (!sender) {
        throw { status: 404, message: 'Sender account not found.' };
      }

      if (sender.balance < amount) {
        throw {
          status: 400,
          code: 'INSUFFICIENT_FUNDS',
          message: `Insufficient balance for transfer. Available balance: ₹${sender.balance.toLocaleString('en-IN')}, Transfer amount: ₹${amount.toLocaleString('en-IN')}.`,
        };
      }

      // Deduct sender balance
      const newSenderBalance = sender.balance - amount;
      const updatedSender = await tx.account.update({
        where: { id: accountId },
        data: { balance: newSenderBalance },
      });

      // If internal account, credit recipient
      if (targetAccount) {
        await tx.account.update({
          where: { id: targetAccount.id },
          data: { balance: targetAccount.balance + amount },
        });

        // Record incoming transaction for recipient
        await tx.transaction.create({
          data: {
            referenceNumber: generateReference('REC'),
            type: 'TRANSFER',
            amount: amount,
            balanceAfter: targetAccount.balance + amount,
            status: 'SUCCESS',
            description: `Fund Received from ${sender.cardHolder} (${sender.accountNumber})`,
            terminalId: 'ATM-BLR-042',
            recipientAccountId: targetAccount.id,
            recipientAccountNumber: targetAccount.accountNumber,
            senderAccountNumber: sender.accountNumber,
            senderAccountId: sender.id,
          },
        });
      }

      const refNum = generateReference('TRF');

      const transferTxn = await tx.transaction.create({
        data: {
          referenceNumber: refNum,
          type: 'TRANSFER',
          amount: amount,
          balanceAfter: newSenderBalance,
          status: 'SUCCESS',
          description: note
            ? `Transfer to ${recipientName} (${cleanRecipientAcc}): ${note}`
            : `Transfer to ${recipientName} (${cleanRecipientAcc})`,
          terminalId: 'ATM-BLR-042',
          senderAccountId: sender.id,
          senderAccountNumber: sender.accountNumber,
          recipientAccountNumber: cleanRecipientAcc,
          recipientName: recipientName,
        },
      });

      return { updatedSender, transferTxn, recipientName };
    });

    res.json({
      success: true,
      message: `Successfully transferred ₹${amount.toLocaleString('en-IN')} to ${result.recipientName}.`,
      receipt: {
        referenceNumber: result.transferTxn.referenceNumber,
        type: 'TRANSFER',
        amount: result.transferTxn.amount,
        balanceAfter: result.updatedSender.balance,
        recipientName: result.recipientName,
        recipientAccountNumber: cleanRecipientAcc,
        date: result.transferTxn.createdAt,
        terminalId: result.transferTxn.terminalId,
        cardHolder: result.updatedSender.cardHolder,
        accountNumber: result.updatedSender.accountNumber,
        status: result.transferTxn.status,
      },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        error: error.message,
        code: error.code || 'BAD_REQUEST',
      });
    }
    console.error('Transfer error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while executing the transfer.',
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const account = req.account;

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderAccountId: account.id },
          { recipientAccountId: account.id },
          { senderAccountNumber: account.accountNumber },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve transaction history.',
    });
  }
};
