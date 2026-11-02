const API_BASE = '/api';

// Token management
let currentSessionToken = localStorage.getItem('atm_session_token') || null;

export const setSessionToken = (token) => {
  currentSessionToken = token;
  if (token) {
    localStorage.setItem('atm_session_token', token);
  } else {
    localStorage.removeItem('atm_session_token');
  }
};

export const getStoredToken = () => currentSessionToken;

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (currentSessionToken) {
    headers['Authorization'] = `Bearer ${currentSessionToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    error: 'Invalid JSON response from server.',
  }));

  if (!response.ok) {
    const errorMsg = data.error || `HTTP ${response.status}: Request failed`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.code = data.code;
    err.details = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  login: async (cardNumber, pin) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ cardNumber, pin }),
    });
    if (res.sessionToken) {
      setSessionToken(res.sessionToken);
    }
    return res;
  },

  logout: async () => {
    try {
      if (currentSessionToken) {
        await request('/auth/logout', { method: 'POST' });
      }
    } catch (e) {
      // Continue cleanup regardless
    } finally {
      setSessionToken(null);
    }
  },

  changePin: async (currentPin, newPin, confirmPin) => {
    return await request('/auth/change-pin', {
      method: 'POST',
      body: JSON.stringify({ currentPin, newPin, confirmPin }),
    });
  },

  unlockAccount: async (cardNumber) => {
    return await request('/auth/unlock', {
      method: 'POST',
      body: JSON.stringify({ cardNumber }),
    });
  },

  // Account
  getBalance: async () => {
    return await request('/account/balance');
  },

  getRecipients: async () => {
    return await request('/account/recipients');
  },

  // Transactions
  withdraw: async (amount) => {
    return await request('/transactions/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount: Number(amount) }),
    });
  },

  deposit: async (amount) => {
    return await request('/transactions/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount: Number(amount) }),
    });
  },

  transfer: async (recipientAccountNumber, amount, note) => {
    return await request('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify({
        recipientAccountNumber,
        amount: Number(amount),
        note,
      }),
    });
  },

  getHistory: async () => {
    return await request('/transactions/history');
  },

  // SET Academic Test Runner
  runSetTests: async () => {
    return await request('/test/run-all', {
      method: 'POST',
    });
  },
};
