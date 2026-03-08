import { create } from 'zustand';
import web3Provider from '../lib/web3Provider';

const useWeb3Store = create((set, get) => ({
  // State
  account: null,
  isConnected: false,
  isLoading: false,
  students: [],
  pools: [],
  stats: null,
  certificates: [],
  error: null,

  // Check for existing wallet connection on mount
  checkConnection: async () => {
    try {
      // Check if wallet was previously connected
      const wasConnected = localStorage.getItem('walletConnected');
      if (wasConnected === 'true' && typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          set({ account: accounts[0], isConnected: true });
          // Load data
          await get().loadStudents();
          await get().loadPools();
          await get().loadStats();
          await get().loadCertificates();
        } else {
          localStorage.removeItem('walletConnected');
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      localStorage.removeItem('walletConnected');
    }
  },

  // Actions
  connectWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const address = await web3Provider.connect();
      set({ account: address, isConnected: true });
      
      // Store connection state
      localStorage.setItem('walletConnected', 'true');
      
      // Load initial data
      await get().loadStudents();
      await get().loadPools();
      await get().loadStats();
      await get().loadCertificates();
      
      return address;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  disconnectWallet: () => {
    localStorage.removeItem('walletConnected');
    set({
      account: null,
      isConnected: false,
      students: [],
      pools: [],
      stats: null,
      certificates: [],
    });
  },

  loadStudents: async () => {
    try {
      const students = await web3Provider.getActiveStudents();
      set({ students });
    } catch (error) {
      console.error('Error loading students:', error);
      set({ error: error.message });
    }
  },

  loadPools: async () => {
    try {
      const pools = await web3Provider.getActivePools();
      set({ pools });
    } catch (error) {
      console.error('Error loading pools:', error);
      set({ error: error.message });
    }
  },

  loadStats: async () => {
    try {
      const stats = await web3Provider.getStats();
      set({ stats });
    } catch (error) {
      console.error('Error loading stats:', error);
      set({ error: error.message });
    }
  },

  loadCertificates: async () => {
    const { account } = get();
    if (!account) return;

    try {
      const certificates = await web3Provider.getDonorCertificates(account);
      set({ certificates });
    } catch (error) {
      console.error('Error loading certificates:', error);
      set({ error: error.message });
    }
  },

  donate: async (studentId, amount, message) => {
    set({ isLoading: true, error: null });
    try {
      const receipt = await web3Provider.donate(studentId, amount, message);
      
      // Refresh data
      await get().loadStudents();
      await get().loadStats();
      
      return receipt;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  contributeToPool: async (poolId, amount) => {
    set({ isLoading: true, error: null });
    try {
      const receipt = await web3Provider.contributeToPool(poolId, amount);
      
      // Refresh data
      await get().loadPools();
      await get().loadStats();
      
      return receipt;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getStudentById: (id) => {
    const { students } = get();
    return students.find((s) => s.id === id);
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useWeb3Store;
