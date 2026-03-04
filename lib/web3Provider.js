import { ethers } from 'ethers';
import DonationPlatformABI from './abis/DonationPlatform.json';
import DonationNFTABI from './abis/DonationNFT.json';
import SchoolPoolABI from './abis/SchoolPool.json';

class Web3Provider {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {
      donationPlatform: null,
      donationNFT: null,
      schoolPool: null,
    };
  }

  async connect() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Check if on Sepolia network
      const network = await this.provider.getNetwork();
      if (network.chainId !== 11155111n) {
        await this.switchToSepolia();
      }
      
      // Initialize contracts
      await this.initializeContracts();
      
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  }

  async switchToSepolia() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } catch (addError) {
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  }

  async initializeContracts() {
    const donationAddress = process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS;
    const nftAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
    const poolAddress = process.env.NEXT_PUBLIC_SCHOOL_POOL_CONTRACT_ADDRESS;

    if (!donationAddress || !nftAddress || !poolAddress) {
      console.warn('Contract addresses not found in environment variables');
      return;
    }

    this.contracts.donationPlatform = new ethers.Contract(
      donationAddress,
      DonationPlatformABI,
      this.signer
    );

    this.contracts.donationNFT = new ethers.Contract(
      nftAddress,
      DonationNFTABI,
      this.signer
    );

    this.contracts.schoolPool = new ethers.Contract(
      poolAddress,
      SchoolPoolABI,
      this.signer
    );
  }

  async donate(studentId, amount, message) {
    if (!this.contracts.donationPlatform) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await this.contracts.donationPlatform.donate(
        studentId,
        message,
        { value: ethers.parseEther(amount.toString()) }
      );
      
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Donation error:', error);
      throw error;
    }
  }

  async contributeToPool(poolId, amount) {
    if (!this.contracts.schoolPool) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await this.contracts.schoolPool.contribute(poolId, {
        value: ethers.parseEther(amount.toString()),
      });
      
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Pool contribution error:', error);
      throw error;
    }
  }

  async getActiveStudents() {
    if (!this.contracts.donationPlatform) {
      throw new Error('Contract not initialized');
    }

    try {
      const students = await this.contracts.donationPlatform.getActiveStudents();
      return students.map((student) => ({
        id: Number(student.id),
        name: student.name,
        location: student.location,
        latitude: Number(student.latitude) / 1000000,
        longitude: Number(student.longitude) / 1000000,
        needs: student.needs,
        targetAmount: ethers.formatEther(student.targetAmount),
        receivedAmount: ethers.formatEther(student.receivedAmount),
        wallet: student.wallet,
        verified: student.verified,
        active: student.active,
        schoolId: Number(student.schoolId),
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async getActivePools() {
    if (!this.contracts.schoolPool) {
      throw new Error('Contract not initialized');
    }

    try {
      const pools = await this.contracts.schoolPool.getActivePools();
      return pools.map((pool) => ({
        id: Number(pool.id),
        schoolId: Number(pool.schoolId),
        schoolName: pool.schoolName,
        goal: pool.goal,
        targetAmount: ethers.formatEther(pool.targetAmount),
        currentAmount: ethers.formatEther(pool.currentAmount),
        deadline: Number(pool.deadline),
        active: pool.active,
        completed: pool.completed,
        contributorCount: Number(pool.contributorCount),
      }));
    } catch (error) {
      console.error('Error fetching pools:', error);
      throw error;
    }
  }

  async getStats() {
    if (!this.contracts.donationPlatform) {
      throw new Error('Contract not initialized');
    }

    try {
      const stats = await this.contracts.donationPlatform.getStats();
      return {
        totalDonated: ethers.formatEther(stats._totalDonated),
        donationCount: Number(stats._donationCount),
        studentCount: Number(stats._studentCount),
        schoolCount: Number(stats._schoolCount),
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  async getDonorCertificates(address) {
    if (!this.contracts.donationNFT) {
      throw new Error('Contract not initialized');
    }

    try {
      const tokenIds = await this.contracts.donationNFT.getDonorCertificates(address);
      const certificates = [];

      for (let tokenId of tokenIds) {
        const cert = await this.contracts.donationNFT.getCertificate(tokenId);
        certificates.push({
          tokenId: Number(cert.tokenId),
          donor: cert.donor,
          donationAmount: ethers.formatEther(cert.donationAmount),
          studentId: Number(cert.studentId),
          studentName: cert.studentName,
          timestamp: Number(cert.timestamp),
          impactDescription: cert.impactDescription,
          metadataURI: cert.metadataURI,
        });
      }

      return certificates;
    } catch (error) {
      console.error('Error fetching certificates:', error);
      throw error;
    }
  }

  async getStudentResources(studentId) {
    if (!this.contracts.donationPlatform) {
      throw new Error('Contract not initialized');
    }

    try {
      const resources = await this.contracts.donationPlatform.getStudentResources(studentId);
      return resources.map((resource) => ({
        studentId: Number(resource.studentId),
        resourceType: resource.resourceType,
        beforeCount: Number(resource.beforeCount),
        afterCount: Number(resource.afterCount),
        timestamp: Number(resource.timestamp),
        proofIPFSHash: resource.proofIPFSHash,
      }));
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  }

  listenToEvents(eventName, callback) {
    if (!this.contracts.donationPlatform) {
      throw new Error('Contract not initialized');
    }

    this.contracts.donationPlatform.on(eventName, callback);
  }

  removeEventListener(eventName, callback) {
    if (!this.contracts.donationPlatform) {
      throw new Error('Contract not initialized');
    }

    this.contracts.donationPlatform.off(eventName, callback);
  }
}

export default new Web3Provider();
