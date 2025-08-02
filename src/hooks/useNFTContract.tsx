
import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { KUVERSE_NFT_ABI, CONTRACT_ADDRESS } from '../contracts/abi';
import { parseEther } from 'viem';
import { useWeb3 } from './useWeb3';

export interface NFTMetadata {
  name: string;
  description: string;
  rarity: string;
  mintedAt: bigint;
}

export interface NFTWithMetadata {
  tokenId: bigint;
  metadata: NFTMetadata;
  tokenURI?: string;
}

export const useNFTContract = () => {
  const { address } = useAccount();
  const { mockMode } = useWeb3();
  const { writeContract, isPending: isMinting } = useWriteContract();
  const [mintingStatus, setMintingStatus] = useState<string>('');
  
  // Initialize with more comprehensive mock NFTs
  const [mockNFTs, setMockNFTs] = useState<NFTWithMetadata[]>([
    {
      tokenId: BigInt(1),
      metadata: {
        name: "Genesis Kuverse NFT",
        description: "The first NFT in the Kuverse collection - a rare digital collectible with unique properties and significance.",
        rarity: "Legendary",
        mintedAt: BigInt(Date.now() - 86400000) // 1 day ago
      },
      tokenURI: "https://via.placeholder.com/400x400/FFD700/000?text=Genesis+NFT"
    },
    {
      tokenId: BigInt(2),
      metadata: {
        name: "Kuverse Explorer",
        description: "A digital badge for early explorers of the Kuverse ecosystem. Shows your pioneering spirit in the metaverse.",
        rarity: "Epic",
        mintedAt: BigInt(Date.now() - 3600000) // 1 hour ago
      },
      tokenURI: "https://via.placeholder.com/400x400/9932CC/FFF?text=Explorer+NFT"
    },
    {
      tokenId: BigInt(3),
      metadata: {
        name: "My Awesome NFT",
        description: "This is a unique digital collectible created through the Kuverse platform with special Epic rarity.",
        rarity: "Epic",
        mintedAt: BigInt(Date.now() - 600000) // 10 minutes ago
      },
      tokenURI: "https://via.placeholder.com/400x400/1E90FF/FFF?text=Awesome+NFT"
    }
  ]);
  const [mockIsMinting, setMockIsMinting] = useState(false);

  // Read user's NFTs
  const { data: userNFTs, refetch: refetchNFTs } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: KUVERSE_NFT_ABI,
    functionName: 'getNFTsByOwner',
    args: address ? [address] : undefined,
  });

  // Read NFT balance
  const { data: nftBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: KUVERSE_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const mintNFT = async (
    name: string,
    description: string,
    rarity: string,
    tokenURI: string
  ) => {
    console.log('🎨 Minting NFT with details:', { name, description, rarity, tokenURI });
    
    if (mockMode) {
      return mintMockNFT(name, description, rarity, tokenURI);
    }

    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      setMintingStatus('Preparing transaction...');
      
      const result = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: KUVERSE_NFT_ABI,
        functionName: 'mintNFT',
        args: [address, name, description, rarity, tokenURI],
      });

      setMintingStatus('Transaction submitted. Waiting for confirmation...');
      
      // Refetch NFTs after minting
      setTimeout(() => {
        refetchNFTs();
        setMintingStatus('NFT minted successfully! 🎉');
      }, 3000);

      return result;
    } catch (error) {
      console.error('Minting failed:', error);
      setMintingStatus('Minting failed. Please try again.');
      throw error;
    }
  };

  const mintMockNFT = async (
    name: string,
    description: string,
    rarity: string,
    tokenURI: string
  ) => {
    console.log('🎭 Starting mock NFT minting process...');
    setMockIsMinting(true);
    setMintingStatus('Preparing mock transaction...');
    
    // Validate inputs
    if (!name || !description || !rarity) {
      throw new Error('Missing required NFT metadata');
    }
    
    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMintingStatus('Mock transaction submitted. Processing...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock token ID and create new NFT
    const newTokenId = BigInt(mockNFTs.length + 1);
    
    // Create appropriate colored placeholder based on rarity
    const getRarityColor = (rarity: string) => {
      switch (rarity.toLowerCase()) {
        case 'legendary': return 'FFD700/000'; // Gold
        case 'epic': return '9932CC/FFF'; // Purple
        case 'rare': return '1E90FF/FFF'; // Blue
        case 'common': return '808080/FFF'; // Gray
        default: return '1E90FF/FFF';
      }
    };
    
    const newNFT: NFTWithMetadata = {
      tokenId: newTokenId,
      metadata: {
        name: name.trim(),
        description: description.trim(),
        rarity: rarity,
        mintedAt: BigInt(Date.now())
      },
      tokenURI: tokenURI || `https://via.placeholder.com/400x400/${getRarityColor(rarity)}?text=${encodeURIComponent(name)}`
    };
    
    console.log('✅ Mock NFT created:', newNFT);
    setMockNFTs(prev => [...prev, newNFT]);
    
    setMintingStatus('NFT minted successfully! 🎉');
    setMockIsMinting(false);
    
    return { hash: '0x' + Math.random().toString(16).slice(2) };
  };

  const getNFTMetadata = async (tokenId: bigint): Promise<NFTMetadata | null> => {
    if (mockMode) {
      const mockNFT = mockNFTs.find(nft => nft.tokenId === tokenId);
      return mockNFT?.metadata || null;
    }

    try {
      const { data } = await useReadContract({
        address: CONTRACT_ADDRESS,
        abi: KUVERSE_NFT_ABI,
        functionName: 'getNFTMetadata',
        args: [tokenId],
      });
      
      return data as NFTMetadata;
    } catch (error) {
      console.error('Failed to get NFT metadata:', error);
      return null;
    }
  };

  const getUserNFTsWithMetadata = (): NFTWithMetadata[] => {
    if (mockMode) {
      console.log('📊 Returning mock NFTs with full metadata:', mockNFTs);
      return mockNFTs;
    }
    // For real contracts, we'd need to fetch metadata for each token
    // This would be implemented when connecting to a real blockchain
    return [];
  };

  return {
    mintNFT,
    userNFTs: mockMode ? mockNFTs.map(nft => nft.tokenId) : (userNFTs as bigint[] | undefined),
    userNFTsWithMetadata: getUserNFTsWithMetadata(),
    nftBalance: mockMode ? BigInt(mockNFTs.length) : (nftBalance as bigint | undefined),
    isMinting: mockMode ? mockIsMinting : isMinting,
    mintingStatus,
    getNFTMetadata,
    refetchNFTs,
  };
};
