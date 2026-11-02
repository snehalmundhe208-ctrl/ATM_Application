# SecureBank ATM Simulation Web Application

> **Academic Project:** Software Engineering & Testing (SET)  
> **Topic:** Automated ATM Simulation System with Persistent Ledger, Cryptographic PIN Authentication, and Automated Test Verification Harness  
> **Color Theme:** Warm Cream & Soft Burnt Orange (`#E88745`, `#FFF8F0`, `#F5EEE6`, `#292929`)

---

## 📌 Project Overview

**SecureBank ATM** is a full-stack, production-grade ATM simulation system designed and developed for academic demonstration in Software Engineering and Testing (SET). The system delivers a tactile, realistic automated teller machine experience inside a clean banking interface.

Unlike static UI prototypes, this system includes a complete Node.js/Express REST backend, atomic database transactions managed by Prisma ORM and SQLite, password hashing (bcrypt), on-screen tactile keypad with physical keyboard listeners, realistic thermal receipt generation with browser printing, and an **Automated SET Testing Panel** that validates 14 test scenarios with zero disruption to demo user data.

---

## 🚀 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide React Icons |
| **Backend** | Node.js (v24+), Express.js (v4), ES Modules |
| **Database & ORM**| SQLite, Prisma ORM 5 |
| **Security** | Bcryptjs PIN hashing, Session token validation, Rate-limiting & Account Lockout |
| **Testing** | Built-in Automated SET Verification & Validation Test Runner |

---

## 🎨 UI/UX Theme & Design Specifications

- **Primary Accent:** Soft Burnt Orange (`#E88745`)
- **Secondary Tone:** Warm Cream (`#FFF8F0`)
- **Background:** Light Beige (`#F5EEE6`)
- **Cards & Surfaces:** Clean White (`#FFFFFF`) with soft shadows
- **Text:** Dark Charcoal (`#292929`)
- **Success:** Soft Green (`#2E7D32` / `#E8F5E9`)
- **Error:** Muted Red (`#D32F2F` / `#FFEBEE`)
- **Atmospheric Background:** Real bank interior photography with soft translucent cream overlays ensuring high legibility and contrast.

---

## 🔑 Demo Account Credentials

| Attribute | Details |
|---|---|
| **Account Holder** | **Bill Gates** |
| **Account Number** | `1234567890123456` |
| **Default ATM PIN** | `1234` *(Hashed with bcrypt in DB)* |
| **Initial Balance** | **₹25,000.00** *(INR)* |
| **Account Type** | Premium Savings Account |
| **ATM Terminal ID**| `ATM-BLR-042` (Bangalore Indiranagar Branch) |

### Predefined Beneficiary Accounts for Fund Transfer Testing:
1. **Rahul Verma:** `9876543210987654` (SecureBank Main Branch — Indiranagar)
2. **Priya Patel:** `5544332211009988` (SecureBank City Center — MG Road)
3. **Amit Kumar:** `1122334455667788` (SecureBank Metro Branch — Koramangala)
4. **Ananya Sen:** `2233445566778899` (SecureBank Tech Park — Whitefield)

---

## 🛠️ Complete Feature Walkthrough

### 1. Welcome & Card Insertion Screen
- Live real-time digital clock and Indian date format.
- SecureBank branding with 24/7 E-Lobby indicator.
- Demo card number display (`1234 •••• •••• 3456`) with 1-click **"Start Banking"**.
- Direct launchpad to the **SET Academic Testing Panel**.

### 2. PIN Authentication Screen
- Masked card number header and 4-digit masked bullet indicators.
- **On-Screen Tactile Keypad (0–9)** with Clear, Backspace, Enter, and Cancel buttons.
- Full physical keyboard listener support (`0-9`, `Backspace`, `Enter`, `Escape`).
- **Security Lockout Engine:** Tracks failed attempts; locks the card temporarily for 5 minutes after 3 consecutive invalid attempts with reviewer override options.

### 3. Main ATM Menu Dashboard
- Embossed virtual debit card showing holder name, masked account, and **Eye toggle** to reveal or hide balance.
- 5 large operation cards with Lucide icons, descriptions, and lift animations:
  1. **Withdraw Cash**
  2. **Deposit Funds**
  3. **Transfer Funds**
  4. **Change PIN**
  5. **Check Balance**
- Quick shortcuts for **Account Statement / Transaction History** and **Eject Card**.

### 4. ATM Operations
- **Withdraw Cash:** Quick amounts (₹500, ₹1,000, ₹2,000, ₹5,000) or custom input in multiples of ₹100. Validates balance before dispensing, displays animated note counter, and generates a printable receipt.
- **Deposit Funds:** Custom amount or presets (₹1,000, ₹2,000, ₹5,000, ₹10,000). Simulates cash intake slot with real-time balance credit.
- **Transfer Funds:** Predefined demo beneficiaries dropdown + manual account entry, self-transfer prevention, balance check, and atomic transfer execution.
- **Change PIN:** 3-step wizard (Current PIN → New 4-digit PIN → Confirmation). Validates difference and updates database with bcrypt hash.
- **Check Balance:** Comprehensive breakdown of available and ledger balances, inquiry timestamp, and 1-click **"Print Balance Slip"**.

### 5. Audit Ledger & Transaction History
- Real-time ledger recording deposits (`+` green), withdrawals (`-` orange), and transfers.
- Filters: All, Withdrawals, Deposits, Transfers.
- Search by reference ID, recipient name, or note.
- Individual **"View Receipt"** modal and full **"Print Statement"** functionality.

### 6. Realistic Thermal Receipt Screen
- Modeled after authentic thermal ATM receipts (dashed dividers, monospaced font, terminal ID, reference number, transaction type, masked account, and remaining balance).
- Includes **"Print Receipt"** invoking clean `@media print` layout without surrounding UI clutter.

### 7. Card Ejection & Safe Exit
- Destroys active session token and clears cache.
- 10-second visual countdown with auto-redirection to the welcome screen.

---

## 🧪 Software Engineering & Testing (SET) Panel

Accessible from the Welcome screen and top navigation header, the **SET Panel** runs an automated test harness validating **all 14 required test scenarios** in under 3 seconds:

| Test ID | Test Scenario | Input Data | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **TC-01** | Correct PIN login | `PIN: 5678` | HTTP 200; Session Authorized | Valid token issued |
| **TC-02** | Incorrect PIN login | `PIN: 9999` | HTTP 401; Attempts Decremented | 401 Unauthorized |
| **TC-03** | Account lock after 3 failed attempts | `3 Failures` | HTTP 423; Flag `isLocked: true` | Card Locked |
| **TC-04** | Valid cash withdrawal | `₹1,000` | HTTP 200; Balance: ₹19,000 | Balance deducted |
| **TC-05** | Withdrawal exceeding balance | `₹50,000` | HTTP 400; `INSUFFICIENT_FUNDS` | Rejection |
| **TC-06** | Withdrawal with invalid amount | `-₹500` | HTTP 400; `INVALID_AMOUNT` | Non-positive rejected |
| **TC-07** | Valid cash deposit | `₹3,000` | HTTP 200; Balance: ₹22,000 | Balance credited |
| **TC-08** | Deposit with invalid amount | `-₹200` | HTTP 400; `INVALID_AMOUNT` | Negative rejected |
| **TC-09** | Fund transfer to beneficiary | `₹2,000` | HTTP 200; Sender debited ₹2,000 | Atomic ledger update |
| **TC-10** | Transfer to invalid recipient | `Acc: 000000` | HTTP 404; `RECIPIENT_NOT_FOUND` | Beneficiary check |
| **TC-11** | Transfer with insufficient balance | `₹99,999` | HTTP 400; `INSUFFICIENT_FUNDS` | Transfer blocked |
| **TC-12** | Successful PIN change | `New: 8765` | HTTP 200; Bcrypt hash updated | DB hash verified |
| **TC-13** | PIN change with wrong old PIN | `Old: 0000` | HTTP 401; `INCORRECT_CURRENT_PIN` | Old PIN enforced |
| **TC-14** | Balance verification audit | `Ledger Math`| ₹20k - 1k + 3k - 2k = ₹20k | 100% Math Consistency |

> 🛡️ **Sandbox Isolation:** All automated tests run against an isolated testing account (`9999888877776666`) and reset after execution. Bill Gates' demo balance (₹25,000) remains clean and intact.

---

## 📁 Project Directory Structure

```text
atm-simulation/
├── client/                     # Frontend React + Vite
│   ├── public/
│   │   └── atm-icon.svg        # SecureBank ATM Favicon
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Header.jsx      # Top branding, live clock, eject card
│   │   │   ├── Keypad.jsx      # Tactile ATM numeric keypad + keyboard listener
│   │   │   ├── BalanceCard.jsx # Embossed debit card with balance eye toggle
│   │   │   ├── OperationCard.jsx # 5 ATM operation tiles
│   │   │   ├── TransactionReceipt.jsx # Thermal receipt with @media print
│   │   │   ├── ConfirmationModal.jsx # Action verification dialog
│   │   │   └── SetTestingModal.jsx   # SET Academic 14-TC Test Harness
│   │   ├── pages/              # ATM Screen Views
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── PinAuthScreen.jsx
│   │   │   ├── MainMenuScreen.jsx
│   │   │   ├── WithdrawScreen.jsx
│   │   │   ├── DepositScreen.jsx
│   │   │   ├── TransferScreen.jsx
│   │   │   ├── ChangePinScreen.jsx
│   │   │   ├── CheckBalanceScreen.jsx
│   │   │   ├── TransactionHistoryScreen.jsx
│   │   │   └── ExitScreen.jsx
│   │   ├── services/
│   │   │   └── api.js          # REST Client & Session Manager
│   │   ├── styles/
│   │   │   └── index.css       # Tailwind & ATM 3D key styles
│   │   ├── App.jsx             # Root State & Router
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js          # Proxy forwarding /api to port 5000
│   └── package.json
├── server/                     # Backend Node.js + Express
│   ├── controllers/
│   │   ├── authController.js   # PIN verification, lockout, change PIN
│   │   ├── accountController.js# Balance retrieval & recipients
│   │   ├── transactionController.js # Atomic withdraw, deposit, transfer
│   │   └── testController.js   # SET Academic Test Runner endpoint
│   ├── middleware/
│   │   └── auth.js             # Bearer session token verification
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── accountRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── testRoutes.js
│   ├── services/
│   │   ├── prisma.js           # Singleton Prisma Client
│   │   └── testRunner.js       # 14 SET automated test cases
│   ├── prisma/
│   │   ├── schema.prisma       # SQLite Schema (Account, Transaction, Recipient)
│   │   └── seed.js             # Initial database seeder
│   ├── server.js               # Express API entry point
│   └── package.json
├── README.md
└── package.json                # Root package manager
```

---

## 💻 Exact Commands to Run Frontend and Backend

### 1. Database Setup (One-Time Setup)
```bash
# Push schema and seed demo records
npm --prefix server run db:setup
```

### 2. Start the Backend API Server
```bash
# Runs on http://localhost:5000
npm --prefix server start
```

### 3. Start the Frontend Application
```bash
# Runs on http://localhost:5173
npm --prefix client run dev
```

### 4. Or Run Both Concurrently from Root
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run client
```

Open your browser at **`http://localhost:5173`** to use the application.

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate with card number and 4-digit PIN | No |
| `POST` | `/api/auth/change-pin` | Update PIN with bcrypt hashing | Yes |
| `POST` | `/api/auth/logout` | Terminate active ATM session | Yes |
| `POST` | `/api/auth/unlock` | Reset failed attempts and unlock account | No |
| `GET` | `/api/account/balance` | Retrieve live balance & account details | Yes |
| `GET` | `/api/accounts/recipients`| List predefined transfer recipients | No |
| `POST` | `/api/transactions/withdraw` | Atomic cash withdrawal | Yes |
| `POST` | `/api/transactions/deposit` | Instant cash deposit | Yes |
| `POST` | `/api/transactions/transfer` | Beneficiary fund transfer | Yes |
| `GET` | `/api/transactions/history` | Retrieve up to 50 recent transactions | Yes |
| `POST` | `/api/test/run-all` | Execute 14-point SET test verification harness | No |
| `GET` | `/api/health` | Health check endpoint | No |

---

## 🎓 Academic Submission Details

- **Project:** Software Engineering and Testing (SET) Project Demo
- **Author:** Full Stack Engineering Submission
- **Demonstration Ready:** All buttons, operations, database constraints, input validations, and test assertions are fully functional without placeholder code or mock limitations.
