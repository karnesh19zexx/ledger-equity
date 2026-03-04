# 🚀 EduChain Deployment Guide

## Step-by-Step Deployment to Sepolia Testnet

### Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] MetaMask browser extension installed
- [ ] Infura account created ([infura.io](https://infura.io))
- [ ] Sepolia testnet ETH obtained (minimum 0.1 ETH)

---

## Part 1: Get Sepolia Test ETH

### Option 1: Alchemy Faucet
1. Visit [sepoliafaucet.com](https://sepoliafaucet.com)
2. Sign in with Alchemy account
3. Enter your wallet address
4. Receive 0.5 ETH

### Option 2: Infura Faucet
1. Visit [infura.io/faucet/sepolia](https://infura.io/faucet/sepolia)
2. Enter wallet address
3. Complete captcha
4. Receive test ETH

---

## Part 2: Configure Infura

1. **Create Infura Project:**
   - Go to [infura.io/dashboard](https://infura.io/dashboard)
   - Click "Create New Key"
   - Select "Web3 API"
   - Name it "EduChain"

2. **Copy API Key:**
   - Copy your Project ID
   - Your RPC URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

---

## Part 3: Environment Setup

1. **Create .env file:**
```bash
cp .env.example .env
```

2. **Fill in values:**
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_metamask_private_key_without_0x
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

3. **Get Private Key from MetaMask:**
   - Open MetaMask
   - Click three dots → Account Details
   - Export Private Key
   - Enter password
   - Copy key (remove 0x prefix)
   - **⚠️ NEVER commit this to Git!**

---

## Part 4: Deploy Smart Contracts

1. **Install dependencies:**
```bash
npm install
```

2. **Compile contracts:**
```bash
npm run compile
```

Expected output:
```
Compiled 3 Solidity files successfully
```

3. **Deploy to Sepolia:**
```bash
npm run deploy
```

Expected output:
```
🚀 Starting deployment to Sepolia...

📝 Deploying DonationPlatform contract...
✅ DonationPlatform deployed to: 0x1234...

📝 Deploying DonationNFT contract...
✅ DonationNFT deployed to: 0x5678...

📝 Deploying SchoolPool contract...
✅ SchoolPool deployed to: 0x9abc...

🌱 Adding sample schools and students...
✅ Added Sunshine Primary School
✅ Added Hope Valley School
✅ Added Future Stars Academy
✅ Added student: Amara Johnson
✅ Added student: Rahul Patel
✅ Added student: Chioma Okafor
✅ Added student: Priya Sharma

🏊 Creating school funding pools...
✅ Created pool for Computer Lab
✅ Created pool for Library Expansion

✨ Deployment complete!
```

4. **Copy contract addresses** from terminal output or `contracts-addresses.json`

---

## Part 5: Configure Frontend

1. **Update .env with contract addresses:**
```env
NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS=0x1234...
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x5678...
NEXT_PUBLIC_SCHOOL_POOL_CONTRACT_ADDRESS=0x9abc...
```

2. **Verify .env file is complete:**
```bash
cat .env
```

All variables should be filled in!

---

## Part 6: Start the Application

1. **Start development server:**
```bash
npm run dev
```

2. **Open browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You should see the EduChain homepage

3. **Connect MetaMask:**
   - Click "Connect Wallet"
   - Select MetaMask
   - Approve connection
   - Confirm you're on Sepolia network

---

## Part 7: Test the Platform

### Test 1: Make a Donation
1. Browse to a student card
2. Click "Donate Now"
3. Enter 0.01 ETH
4. Add message
5. Confirm in MetaMask
6. Wait for transaction confirmation
7. ✅ Success toast should appear

### Test 2: View Dashboard
1. Navigate to Dashboard
2. Check your donation appears in history
3. View NFT Certificates tab
4. ✅ Your certificate should be visible

### Test 3: Impact Map
1. Navigate to Impact Map
2. ✅ See student markers on global map
3. Click a marker
4. ✅ View student details

### Test 4: School Pool
1. Go to home page
2. Switch to "School Pools" tab
3. Contribute to a pool
4. ✅ Pool progress updates

---

## Troubleshooting

### Issue: "Insufficient funds"
**Solution:** Get more Sepolia ETH from faucet

### Issue: "Wrong network"
**Solution:** 
1. Open MetaMask
2. Switch to Sepolia Test Network
3. Refresh page

### Issue: "Contract not deployed"
**Solution:**
1. Check .env has contract addresses
2. Restart dev server: `npm run dev`

### Issue: "Transaction failed"
**Solution:**
1. Check you have enough ETH for gas
2. Try increasing gas limit in MetaMask

### Issue: "MetaMask not detected"
**Solution:**
1. Install MetaMask extension
2. Refresh page
3. Clear browser cache

---

## Verify Deployment on Etherscan

1. Visit [sepolia.etherscan.io](https://sepolia.etherscan.io)
2. Enter your contract address
3. You should see:
   - Contract creation transaction
   - Recent transactions
   - Contract code (if verified)

---

## Production Deployment (Mainnet)

⚠️ **WARNING: Use real ETH cautiously!**

1. **Get mainnet ETH** (purchase from exchange)
2. **Update hardhat.config.js:**
```javascript
mainnet: {
  url: process.env.MAINNET_RPC_URL,
  accounts: [process.env.PRIVATE_KEY],
  chainId: 1
}
```
3. **Deploy:** `npm run deploy -- --network mainnet`
4. **Verify contracts** on Etherscan
5. **Security audit** recommended before handling real funds

---

## Next Steps

- [ ] Add more students via contract
- [ ] Create additional school pools
- [ ] Share platform link with donors
- [ ] Monitor transactions on Etherscan
- [ ] Collect feedback and iterate

---

**🎉 Congratulations! Your EduChain platform is live!**
