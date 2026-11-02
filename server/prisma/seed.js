import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('--- Starting Database Seeding ---');

  // Hash PINs
  const pin1234Hash = await bcrypt.hash('1234', 10);
  const pin5678Hash = await bcrypt.hash('5678', 10);

  // 1. Seed or update demo account: Bill Gates
  const billAccount = await prisma.account.upsert({
    where: { accountNumber: '1234567890123456' },
    update: {
      cardHolder: 'Bill Gates',
      balance: 25000.0,
      pinHash: pin1234Hash,
      failedAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      status: 'ACTIVE',
      accountType: 'Savings Account',
    },
    create: {
      accountNumber: '1234567890123456',
      cardHolder: 'Bill Gates',
      balance: 25000.0,
      pinHash: pin1234Hash,
      failedAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      status: 'ACTIVE',
      accountType: 'Savings Account',
    },
  });

  console.log(`Demo Account seeded: ${billAccount.cardHolder} (${billAccount.accountNumber}) - Balance: ₹${billAccount.balance}`);

  // 2. Seed or update isolated SET Test Account
  const testAccount = await prisma.account.upsert({
    where: { accountNumber: '9999888877776666' },
    update: {
      cardHolder: 'SET Testing Account',
      balance: 20000.0,
      pinHash: pin5678Hash,
      failedAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      status: 'ACTIVE',
      accountType: 'Test Savings Account',
    },
    create: {
      accountNumber: '9999888877776666',
      cardHolder: 'SET Testing Account',
      balance: 20000.0,
      pinHash: pin5678Hash,
      failedAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      status: 'ACTIVE',
      accountType: 'Test Savings Account',
    },
  });

  console.log(`Isolated SET Account seeded: ${testAccount.cardHolder} (${testAccount.accountNumber})`);

  // 3. Seed Predefined Recipient Accounts
  const recipientsData = [
    {
      name: 'Rahul Verma',
      accountNumber: '9876543210987654',
      bankName: 'SecureBank Main Branch',
      branch: 'Indiranagar, Bengaluru',
      ifscCode: 'SCBK0001001',
      accountType: 'Savings',
    },
    {
      name: 'Priya Patel',
      accountNumber: '5544332211009988',
      bankName: 'SecureBank City Center',
      branch: 'MG Road, Bengaluru',
      ifscCode: 'SCBK0001002',
      accountType: 'Current',
    },
    {
      name: 'Amit Kumar',
      accountNumber: '1122334455667788',
      bankName: 'SecureBank Metro Branch',
      branch: 'Koramangala, Bengaluru',
      ifscCode: 'SCBK0001003',
      accountType: 'Savings',
    },
    {
      name: 'Ananya Sen',
      accountNumber: '2233445566778899',
      bankName: 'SecureBank Tech Park',
      branch: 'Whitefield, Bengaluru',
      ifscCode: 'SCBK0001004',
      accountType: 'Salary Account',
    },
  ];

  for (const r of recipientsData) {
    await prisma.recipient.upsert({
      where: { accountNumber: r.accountNumber },
      update: r,
      create: r,
    });
  }
  console.log(`Seeded ${recipientsData.length} predefined recipients`);

  // 4. Seed initial realistic transaction history for Bill Gates if empty
  const existingTxns = await prisma.transaction.count({
    where: { senderAccountId: billAccount.id },
  });

  if (existingTxns === 0) {
    const d1 = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const d2 = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    const d3 = new Date(Date.now() - 4 * 60 * 60 * 1000);

    await prisma.transaction.createMany({
      data: [
        {
          referenceNumber: `TXN-INIT-001`,
          type: 'DEPOSIT',
          amount: 20000.0,
          balanceAfter: 20000.0,
          status: 'SUCCESS',
          description: 'Account Opening Opening Deposit',
          senderAccountId: billAccount.id,
          senderAccountNumber: billAccount.accountNumber,
          createdAt: d1,
        },
        {
          referenceNumber: `TXN-INIT-002`,
          type: 'DEPOSIT',
          amount: 10000.0,
          balanceAfter: 30000.0,
          status: 'SUCCESS',
          description: 'ATM Cash Deposit (Denominations: 500x20)',
          senderAccountId: billAccount.id,
          senderAccountNumber: billAccount.accountNumber,
          createdAt: d2,
        },
        {
          referenceNumber: `TXN-INIT-003`,
          type: 'TRANSFER',
          amount: 5000.0,
          balanceAfter: 25000.0,
          status: 'SUCCESS',
          description: 'Fund Transfer to Rahul Verma',
          senderAccountId: billAccount.id,
          senderAccountNumber: billAccount.accountNumber,
          recipientAccountNumber: '9876543210987654',
          recipientName: 'Rahul Verma',
          createdAt: d3,
        },
      ],
    });
    console.log('Seeded 3 realistic initial transactions for Bill Gates');
  }

  console.log('--- Database Seeding Completed Successfully ---');
}

// Run if called directly
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .catch((err) => {
      console.error('Seeding error:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
