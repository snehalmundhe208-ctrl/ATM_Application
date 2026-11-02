import prisma from '../services/prisma.js';

export const getBalance = async (req, res) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: req.account.id },
      select: {
        id: true,
        accountNumber: true,
        cardHolder: true,
        balance: true,
        accountType: true,
        status: true,
        updatedAt: true,
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account record not found.',
      });
    }

    res.json({
      success: true,
      data: {
        accountNumber: account.accountNumber,
        cardHolder: account.cardHolder,
        accountType: account.accountType,
        balance: account.balance,
        status: account.status,
        lastUpdated: account.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve account balance.',
    });
  }
};

export const getRecipients = async (req, res) => {
  try {
    const recipients = await prisma.recipient.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: recipients,
    });
  } catch (error) {
    console.error('Get recipients error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to load demo recipients list.',
    });
  }
};
