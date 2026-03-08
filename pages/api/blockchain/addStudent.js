import { ethers } from 'ethers';
import DonationPlatformABI from '../../../lib/abis/DonationPlatform.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, school, location, story, targetAmount, walletAddress } = req.body;

    // Validate inputs
    if (!name || !school || !location || !story || !targetAmount || !walletAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Setup blockchain connection
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    const contractAddress = process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS;
    const contract = new ethers.Contract(contractAddress, DonationPlatformABI.abi, wallet);

    // Convert target amount to wei
    const targetAmountWei = ethers.parseEther(targetAmount.toString());

    console.log('Adding student to blockchain:', name);

    // Call smart contract to add student
    const tx = await contract.addStudent(
      name,
      school,
      location,
      story,
      targetAmountWei,
      walletAddress
    );

    console.log('Transaction sent:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    
    console.log('Transaction confirmed:', receipt.transactionHash);

    // Get the student ID from the event
    const studentAddedEvent = receipt.logs.find(
      log => log.topics[0] === ethers.id('StudentAdded(uint256,string,address)')
    );

    let studentId = null;
    if (studentAddedEvent) {
      const decodedLog = contract.interface.parseLog({
        topics: studentAddedEvent.topics,
        data: studentAddedEvent.data
      });
      studentId = decodedLog.args[0].toString();
    }

    return res.status(200).json({
      success: true,
      transactionHash: receipt.transactionHash,
      studentId: studentId,
      message: 'Student added to blockchain successfully'
    });

  } catch (error) {
    console.error('Blockchain error:', error);
    return res.status(500).json({ 
      error: 'Failed to add student to blockchain',
      details: error.message 
    });
  }
}
