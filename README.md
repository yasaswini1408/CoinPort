# CoinPort
A decentralized payment system that lets users in India pay in INR via UPI, while merchants receive stablecoins (USDT) instantly in their crypto wallets. Designed to simplify cross-border payments, reduce transaction fees, and promote crypto adoption using blockchain technology.
# 🪙 CoinPort — Simplifying Digital & Cross-Border Payments  

## 💡 Overview  
**CoinPort** is a modern payment platform that bridges **traditional UPI payments** and **blockchain-based stablecoins**.  
It allows users to **pay in INR via UPI**, while merchants **instantly receive stablecoins (USDT)** in their crypto wallets — reducing fees, delays, and complexity.

---

## 🚀 Features  
- 💰 Real-time **INR → USDT** conversion using CoinGecko API  
- 🔗 **UPI payment simulation** (frontend flow)  
- 🪙 **MetaMask wallet integration** for merchants  
- ⚙️ **ERC20 Smart Contract** deployment on Sepolia Testnet  
- 💨 **Low fees** and **instant settlement**  
- 🔒 Fully **transparent** and blockchain-powered  

---

## 🧱 Tech Stack  

| Layer | Technologies |
|--------|---------------|
| **Frontend** | React, Vite, TailwindCSS, ethers.js |
| **Backend** | Node.js, Express, CoinGecko API |
| **Blockchain** | Solidity, Hardhat, Sepolia Testnet (ERC20 Token) |
| **Wallets** | MetaMask, Coinbase Wallet |

---

## 🖥️ Frontend Setup  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/coinport.git
cd coinport
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Run the App  
```bash
npm run dev
```

Open your browser and visit:  
👉 **http://localhost:5173**

---

## ⚙️ Backend Setup (Optional)  
If you plan to connect real INR↔USDT conversions or UPI APIs:

```bash
cd backend
npm install
npm start
```

Create a `.env` file and add:
```
COINGECKO_API=https://api.coingecko.com/api/v3/simple/price
PORT=5000
```

---

## 💼 Smart Contract  
- **Token Type:** ERC20 (USDT equivalent)  
- **Network:** Sepolia Testnet  
- **Tools:** Solidity, Hardhat  
- Handles token minting and transfers for merchants upon payment confirmation.  

---

---

## 🔗 How It Works  

1️⃣ **User pays in INR** using UPI (simulated).  
2️⃣ **CoinPort converts** the payment amount to USDT using live rates.  
3️⃣ **Smart contract** sends USDT to the merchant’s connected wallet.  
4️⃣ **Merchant receives** tokens instantly and securely.

---

## 🧠 Workflow Diagram  

```
User → UPI Payment → CoinPort Backend → Smart Contract → Merchant Wallet
```

---

## 🛠️ Future Enhancements  
- ✅ Integrate real UPI payment APIs (Razorpay / Juspay Sandbox)  
- ✅ Add merchant dashboard with transaction history  
- ✅ Multi-stablecoin support (USDC, DAI)  
- ✅ Deploy to Ethereum Mainnet or Polygon  

---

## 👨‍💻 Team Members 
**svl yasaswani**
**V.Devamma**
**v.Sai Varshitha**

## 📜 License  
This project is licensed under the **MIT License** — feel free to use and improve it.

---

### 🧭 Tagline  
> “Pay in INR. Receive in Crypto. Fast. Secure. Borderless.”



