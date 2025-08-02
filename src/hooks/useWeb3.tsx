
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export const useWeb3 = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isClient, setIsClient] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  
  // Mock mode for demo purposes with persistent state
  const [mockMode, setMockMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kuverse_mock_mode') === 'true';
    }
    return false;
  });
  
  const [mockAddress, setMockAddress] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kuverse_mock_address') || '';
    }
    return '';
  });
  
  const [mockConnected, setMockConnected] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kuverse_mock_connected') === 'true';
    }
    return false;
  });

  useEffect(() => {
    setIsClient(true);
    // Check if MetaMask is installed
    const checkMetaMask = () => {
      if (typeof window !== 'undefined') {
        setIsMetaMaskInstalled(!!window.ethereum?.isMetaMask);
      }
    };
    checkMetaMask();
  }, []);

  // Persist mock mode state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kuverse_mock_mode', mockMode.toString());
      localStorage.setItem('kuverse_mock_address', mockAddress);
      localStorage.setItem('kuverse_mock_connected', mockConnected.toString());
    }
  }, [mockMode, mockAddress, mockConnected]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum?.isMetaMask) {
        throw new Error('MetaMask not found. Please install MetaMask.');
      }

      const metaMaskConnector = connectors.find(
        (connector) => connector.id === 'metaMask' || connector.id === 'io.metamask'
      );
      
      const injectedConnector = connectors.find(
        (connector) => connector.id === 'injected'
      );

      const connector = metaMaskConnector || injectedConnector;
      
      if (connector) {
        await connect({ connector });
      } else {
        throw new Error('No compatible wallet connector found.');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const connectMockWallet = () => {
    const demoAddress = '0x742d35Cc6634C0532925a3b8D0c6b85c60b56ca4';
    setMockAddress(demoAddress);
    setMockConnected(true);
    setMockMode(true);
  };

  const disconnectWallet = () => {
    if (mockMode) {
      setMockConnected(false);
      setMockAddress('');
      setMockMode(false);
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kuverse_mock_mode');
        localStorage.removeItem('kuverse_mock_address');
        localStorage.removeItem('kuverse_mock_connected');
      }
    } else {
      disconnect();
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    address: mockMode ? mockAddress : address,
    isConnected: isClient ? (mockMode ? mockConnected : isConnected) : false,
    connectWallet,
    connectMockWallet,
    disconnectWallet,
    formatAddress,
    error,
    isPending,
    isMetaMaskInstalled,
    mockMode,
  };
};
