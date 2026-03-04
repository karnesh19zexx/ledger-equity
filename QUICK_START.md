# ⚡ EduChain Quick Start Guide

Get up and running in 5 minutes!

## 🎯 Prerequisites
- Node.js 18+
- MetaMask installed
- Sepolia test ETH

## 🚀 Quick Setup

### 1️⃣ Clone & Install (1 min)
```bash
git clone <repo-url>
cd educhain-donation-platform
npm install
```

### 2️⃣ Get Test ETH (2 min)
1. Visit [sepoliafaucet.com](https://sepoliafaucet.com)
2. Enter your MetaMask address
3. Get 0.5 Sepolia ETH

### 3️⃣ Configure Environment (1 min)
```bash
# Copy example file
cp .env.example .env

# Edit .env and add:
# - Your Infura API key
# - Your MetaMask private key
```

Get Infura key: [infura.io](https://infura.io)

### 4️⃣ Deploy Contracts (1 min)
```bash
npm run compile
npm run deploy
```

Copy the contract addresses from output to `.env` file.

### 5️⃣ Start Platform (<1 min)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### 6️⃣ Connect & Donate
1. Click "Connect Wallet"
2. Select a student
3. Click "Donate Now"
4. Enter 0.01 ETH
5. Confirm in MetaMask
6. Receive NFT certificate!

## 🎨 Features to Explore

- **Dashboard** - View your donation history & NFT certificates
- **Impact Map** - See global impact visualization
- **School Pools** - Contribute to collaborative funding
- **Resource Tracker** - View before/after improvements

## 📚 Need More Help?

- Full guide: `README.md`
- Deployment: `DEPLOYMENT_GUIDE.md`
- Demo prep: `DEMO.md`

## 🐛 Issues?

Check `DEPLOYMENT_GUIDE.md` troubleshooting section.

---

**That's it! You're ready to make an impact! 🌍**
