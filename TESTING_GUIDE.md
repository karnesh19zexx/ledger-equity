# 🧪 Ledger Equity Testing Guide

## Pre-Testing Checklist

Before you begin testing:
- [ ] All dependencies installed (`npm install`)
- [ ] Contracts compiled (`npm run compile`)
- [ ] Contracts deployed to Sepolia (`npm run deploy`)
- [ ] `.env` file configured with contract addresses
- [ ] MetaMask has Sepolia test ETH (minimum 0.1 ETH)
- [ ] Development server running (`npm run dev`)

---

## Test Suite 1: Wallet Connection

### Test 1.1: Connect MetaMask
**Steps:**
1. Open http://localhost:3000
2. Click "Connect Wallet" button
3. Select MetaMask in popup
4. Approve connection

**Expected Result:**
✅ Wallet address displayed in navbar  
✅ "Connect Wallet" button changes to address (e.g., "0x1234...5678")  
✅ Student cards and pools load automatically  

**Troubleshooting:**
- If MetaMask doesn't open: Refresh page and try again
- If wrong network: Switch to Sepolia in MetaMask

---

### Test 1.2: Network Switching
**Steps:**
1. With wallet connected, switch MetaMask to different network
2. Platform should detect wrong network
3. Switch back to Sepolia

**Expected Result:**
✅ Platform prompts to switch networks  
✅ Auto-switches when approved  

---

## Test Suite 2: Student Donations

### Test 2.1: View Students
**Steps:**
1. Ensure wallet is connected
2. Scroll to "Individual Students" section
3. View student cards

**Expected Result:**
✅ 3-4 student cards visible  
✅ Each shows: name, location, needs, progress bar  
✅ Verified badges displayed  
✅ Progress percentages calculated correctly  

---

### Test 2.2: Make Small Donation
**Steps:**
1. Click "Donate Now" on first student
2. Enter amount: `0.01` ETH
3. Add message: "Good luck with your studies!"
4. Click "Confirm Donation"
5. Approve in MetaMask

**Expected Result:**
✅ Modal opens with form  
✅ MetaMask popup appears  
✅ Transaction confirms within 30 seconds  
✅ Success toast notification appears  
✅ Student card progress bar updates  
✅ Page updates without refresh  

**Gas Cost:** ~$0.50 USD on Sepolia

---

### Test 2.3: Make Larger Donation
**Steps:**
1. Select different student
2. Donate `0.05` ETH

**Expected Result:**
✅ Transaction succeeds  
✅ Progress bar shows significant increase  
✅ Stats update in real-time  

---

### Test 2.4: Donation Validation
**Steps:**
1. Try to donate `0` ETH
2. Try to donate without message (should work)
3. Try to donate with very long message

**Expected Result:**
✅ Zero amount rejected with error  
✅ Empty message allowed  
✅ Long message accepted  

---

## Test Suite 3: School Pools

### Test 3.1: View Pools
**Steps:**
1. Click "School Pools" tab on homepage
2. View available pools

**Expected Result:**
✅ 2 school pools displayed  
✅ Each shows: school name, goal, progress, deadline  
✅ Contributor count visible  
✅ Days remaining calculated  

---

### Test 3.2: Contribute to Pool
**Steps:**
1. Click "Contribute Now" on a pool
2. Enter `0.02` ETH
3. Confirm transaction

**Expected Result:**
✅ Modal opens  
✅ Transaction processes  
✅ Pool progress updates  
✅ Contributor count increases  

---

## Test Suite 4: Dashboard

### Test 4.1: View Overview
**Steps:**
1. Navigate to Dashboard
2. Click "Overview" tab

**Expected Result:**
✅ 4 stat cards display:
   - My Donations count
   - Total Impact (ETH)
   - Students Helped
   - NFTs Earned
✅ Charts render correctly:
   - Donation Trend (line chart)
   - Impact by Region (pie chart)
   - Resource Distribution (bar chart)
✅ Recent Activity shows donations  

---

### Test 4.2: View NFT Certificates
**Steps:**
1. Click "NFT Certificates" tab
2. View your certificates

**Expected Result:**
✅ Certificate cards display for each donation  
✅ Each shows:
   - Unique NFT number
   - Student name
   - Donation amount
   - Date
   - Impact description
✅ "Download" and "View on Chain" buttons visible  

**Note:** If no certificates show immediately after donation, refresh page or wait for blockchain confirmation.

---

### Test 4.3: View Resource Tracker
**Steps:**
1. Click "Resource Tracker" tab
2. View before/after improvements

**Expected Result:**
✅ Each student's resources listed  
✅ Before vs After counts displayed  
✅ Improvement percentages calculated  
✅ Resource icons displayed (books, laptops, etc.)  

---

## Test Suite 5: Impact Map

### Test 5.1: View Global Map
**Steps:**
1. Navigate to Impact Map page
2. Wait for map to load

**Expected Result:**
✅ Interactive map renders  
✅ Markers show student locations  
✅ Markers color-coded by funding progress:
   - Green: 75-100% funded
   - Yellow: 50-75% funded
   - Blue: 25-50% funded
   - Gray: 0-25% funded
✅ 3 stat cards show aggregated data  

---

### Test 5.2: Interact with Markers
**Steps:**
1. Click on a marker
2. View popup
3. Click "View Details" in popup

**Expected Result:**
✅ Popup shows student info  
✅ Progress bar in popup  
✅ Clicking marker zooms map  
✅ Right panel updates with student details  

---

### Test 5.3: Student Detail View
**Steps:**
1. Click on marker or student in list
2. View detailed panel

**Expected Result:**
✅ Student name, location, needs displayed  
✅ Current progress shown  
✅ "Donate Now" button functional  
✅ "Back to list" button returns to full view  

---

## Test Suite 6: UI/UX

### Test 6.1: Responsive Design
**Steps:**
1. Resize browser to mobile width (375px)
2. Navigate through all pages
3. Test tablet width (768px)
4. Test desktop width (1920px)

**Expected Result:**
✅ All pages responsive  
✅ No horizontal scroll  
✅ Navigation adapts to screen size  
✅ Cards stack properly on mobile  
✅ Map remains interactive on all sizes  

---

### Test 6.2: Animations
**Steps:**
1. Navigate between pages
2. Hover over cards
3. Scroll through content

**Expected Result:**
✅ Smooth page transitions  
✅ Cards lift on hover  
✅ Progress bars animate  
✅ Stats count up on load  
✅ No janky animations  

---

### Test 6.3: Loading States
**Steps:**
1. Disconnect wallet and reconnect
2. Make donation and watch loading spinner
3. Navigate while transactions pending

**Expected Result:**
✅ Loading indicators show  
✅ Buttons disabled during processing  
✅ Success/error messages clear  

---

## Test Suite 7: Error Handling

### Test 7.1: Insufficient Funds
**Steps:**
1. Try to donate more ETH than you have
2. Confirm in MetaMask

**Expected Result:**
✅ MetaMask shows insufficient funds error  
✅ Platform displays error toast  
✅ User can try again with lower amount  

---

### Test 7.2: Transaction Rejection
**Steps:**
1. Start donation process
2. Reject transaction in MetaMask

**Expected Result:**
✅ Error toast appears  
✅ Modal stays open for retry  
✅ No partial state updates  

---

### Test 7.3: Network Issues
**Steps:**
1. Disconnect internet
2. Try to make donation
3. Reconnect internet

**Expected Result:**
✅ Clear error message  
✅ Platform recovers gracefully  

---

## Test Suite 8: Smart Contract Verification

### Test 8.1: View on Etherscan
**Steps:**
1. Copy contract address from `.env`
2. Visit sepolia.etherscan.io
3. Paste address and search

**Expected Result:**
✅ Contract found  
✅ Recent transactions visible  
✅ Your donations appear in transaction list  

---

### Test 8.2: Verify Donation on Chain
**Steps:**
1. After making donation, copy transaction hash
2. View on Etherscan
3. Check transaction details

**Expected Result:**
✅ Transaction confirmed  
✅ From: Your wallet address  
✅ To: DonationPlatform contract  
✅ Value: Amount you donated  
✅ Status: Success  

---

## Performance Tests

### Test 9.1: Load Time
**Expected:**
- Initial page load: < 3 seconds
- Page transitions: < 500ms
- Wallet connection: < 2 seconds
- Map render: < 5 seconds

### Test 9.2: Transaction Speed
**Expected:**
- Donation confirmation: 10-30 seconds (Sepolia)
- NFT minting: 15-45 seconds
- Data refresh: Instant to 10 seconds

---

## Browser Compatibility

Test on:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

**Expected:**
✅ All features work across browsers  
✅ MetaMask extension available  

---

## Acceptance Criteria

Before considering testing complete:

**Functionality:**
- [x] All pages load without errors
- [x] Wallet connection works
- [x] Donations process successfully
- [x] NFT certificates appear
- [x] Map displays correctly
- [x] Dashboard shows accurate data
- [x] School pools functional

**UI/UX:**
- [x] Responsive on all screen sizes
- [x] Animations smooth
- [x] No console errors
- [x] Professional appearance

**Smart Contracts:**
- [x] Deployed to Sepolia
- [x] Transactions confirm
- [x] Data persists on blockchain
- [x] Events emit correctly

---

## Bug Reporting Template

If you find issues:

```
**Bug Title:** Brief description

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happened

**Screenshots:**
[If applicable]

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- MetaMask: v11.0
- Wallet Balance: 0.1 ETH
```

---

## Testing Complete! ✅

Once all tests pass:
- Platform is ready for demo
- Safe to present to judges
- Production-ready (for testnet)

**Need help?** Check `DEPLOYMENT_GUIDE.md` troubleshooting section.

---

**Happy Testing! 🚀**
