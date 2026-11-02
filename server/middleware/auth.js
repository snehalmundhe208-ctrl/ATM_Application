import prisma from '../services/prisma.js';

// Simple in-memory session store (or token resolver) mapping sessionToken -> { accountNumber, expiresAt }
const sessions = new Map();

export function createSession(accountNumber) {
  const token = `atm-sess-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15-minute ATM session validity
  sessions.set(token, { accountNumber, expiresAt });
  return token;
}

export function endSession(token) {
  if (token) {
    sessions.delete(token);
  }
}

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.headers['x-session-token']) {
      token = req.headers['x-session-token'];
    }

    // Also support direct account number header for SET test runner or fallback
    const directAccount = req.headers['x-account-number'];

    let accountNumber = null;

    if (token && sessions.has(token)) {
      const sess = sessions.get(token);
      if (Date.now() > sess.expiresAt) {
        sessions.delete(token);
        return res.status(401).json({
          success: false,
          error: 'Session expired. Please re-insert your card and enter PIN.',
          code: 'SESSION_EXPIRED',
        });
      }
      // Refresh session activity timer
      sess.expiresAt = Date.now() + 15 * 60 * 1000;
      accountNumber = sess.accountNumber;
    } else if (directAccount) {
      accountNumber = directAccount;
    }

    if (!accountNumber) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. No active ATM card session.',
        code: 'UNAUTHORIZED',
      });
    }

    const account = await prisma.account.findUnique({
      where: { accountNumber },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found.',
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    if (account.isLocked) {
      // Check if lockedUntil has expired
      if (account.lockedUntil && new Date() > account.lockedUntil) {
        // Unlock account automatically
        await prisma.account.update({
          where: { id: account.id },
          data: { isLocked: false, failedAttempts: 0, lockedUntil: null, status: 'ACTIVE' },
        });
        account.isLocked = false;
        account.failedAttempts = 0;
      } else {
        return res.status(423).json({
          success: false,
          error: 'This account is temporarily locked due to 3 failed PIN attempts. Please contact branch or try later.',
          code: 'ACCOUNT_LOCKED',
          lockedUntil: account.lockedUntil,
        });
      }
    }

    req.account = account;
    req.sessionToken = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during authentication verification.',
    });
  }
}
