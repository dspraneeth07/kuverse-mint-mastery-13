
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Wallet, Hash, Calendar, Trophy, LogOut, Sparkles, Eye, Crown, Gem, Circle, Star } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useNFTContract } from '@/hooks/useNFTContract';
import { WalletConnect } from './WalletConnect';

export const UserProfile = () => {
  const { address, isConnected, formatAddress, disconnectWallet, mockMode } = useWeb3();
  const { userNFTsWithMetadata, nftBalance } = useNFTContract();

  console.log('👤 UserProfile - isConnected:', isConnected);
  console.log('👤 UserProfile - address:', address);
  console.log('👤 UserProfile - userNFTsWithMetadata:', userNFTsWithMetadata);
  console.log('👤 UserProfile - nftBalance:', nftBalance);

  if (!isConnected) {
    return (
      <div className="space-y-8">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-950">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold font-poppins">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <User className="h-8 w-8 text-white" />
              </div>
              👤 User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-20"></div>
              <div className="relative w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse-glow">
                <Wallet className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-poppins">🔗 Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              Connect your wallet to view your profile and discover your amazing NFT collection
            </p>
            <WalletConnect />
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 text-yellow-700 border-yellow-500/30 dark:text-yellow-400 shadow-yellow-500/20';
      case 'epic': return 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border-purple-500/30 dark:text-purple-400 shadow-purple-500/20';
      case 'rare': return 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 border-blue-500/30 dark:text-blue-400 shadow-blue-500/20';
      case 'common': return 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 text-gray-700 border-gray-500/30 dark:text-gray-400 shadow-gray-500/20';
      default: return 'bg-gradient-to-r from-primary/10 to-primary/20 text-primary border-primary/30 shadow-primary/20';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'epic': return <Gem className="h-4 w-4 text-purple-600" />;
      case 'rare': return <Star className="h-4 w-4 text-blue-600 fill-current" />;
      case 'common': return <Circle className="h-4 w-4 text-gray-600" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const currentNFTs = userNFTsWithMetadata || [];
  const currentBalance = nftBalance ? Number(nftBalance) : 0;

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-poppins">👤 Your Profile</h2>
                {mockMode && (
                  <Badge className="mt-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 border-green-500/30 shadow-lg">
                    🚀 Demo Mode Active
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnectWallet}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 font-semibold shadow-lg hover:shadow-red-200/50 transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                    <Wallet className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">💼 Wallet Address</p>
                    <p className="text-xl font-bold font-mono mb-2">
                      {formatAddress(address!)}
                    </p>
                    <p className="text-xs text-muted-foreground break-all bg-muted/30 p-2 rounded-lg">
                      <strong>Full:</strong> {address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg animate-pulse-glow">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">🏆 NFTs Owned</p>
                    <p className="text-4xl font-bold text-green-600 font-poppins">
                      {currentBalance}
                    </p>
                    <Badge className="mt-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-0">
                      📈 Digital Assets
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-4 text-3xl font-bold font-poppins">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            ✨ Your NFT Collection ({currentNFTs.length} NFTs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentNFTs && currentNFTs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentNFTs.map((nft) => (
                <Card key={nft.tokenId.toString()} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                  <CardContent className="p-8 relative">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl mb-6 flex items-center justify-center border-2 border-dashed border-primary/30 relative overflow-hidden group-hover:border-primary/50 transition-all duration-300">
                      <div className="text-center">
                        <div className="text-8xl mb-3 animate-float">
                          {nft.metadata.rarity.toLowerCase() === 'legendary' ? '👑' : 
                           nft.metadata.rarity.toLowerCase() === 'epic' ? '💜' :
                           nft.metadata.rarity.toLowerCase() === 'rare' ? '💎' : '⚪'}
                        </div>
                        <div className="text-lg font-bold text-muted-foreground">#{nft.tokenId.toString()}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-xl truncate flex-1 mr-2 font-poppins">{nft.metadata.name}</h4>
                        <Badge variant="outline" className="text-sm shrink-0 font-semibold">
                          #{nft.tokenId.toString()}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4rem] leading-relaxed">
                        {nft.metadata.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        <Badge className={`${getRarityColor(nft.metadata.rarity)} border shadow-lg flex items-center gap-2 px-3 py-1`}>
                          {getRarityIcon(nft.metadata.rarity)}
                          <span className="font-semibold">{nft.metadata.rarity}</span>
                        </Badge>
                        <Badge variant="secondary" className="text-sm bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-0 shadow-lg px-3 py-1">
                          🌟 Kuverse Collection
                        </Badge>
                      </div>
                      
                      <div className="pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">Minted: {formatTimestamp(nft.metadata.mintedAt)}</span>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl p-4 border shadow-inner">
                            <div className="grid grid-cols-1 gap-4 text-sm">
                              <div>
                                <div className="font-bold text-muted-foreground mb-2 flex items-center gap-2">
                                  <Hash className="h-4 w-4" />
                                  NFT Details
                                </div>
                                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 space-y-2">
                                  <div className="flex justify-between">
                                    <span className="font-semibold">Name:</span>
                                    <span className="font-bold text-primary">{nft.metadata.name}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-semibold">Rarity:</span>
                                    <span className="font-bold">{nft.metadata.rarity}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-semibold">Token ID:</span>
                                    <span className="font-mono text-sm">#{nft.tokenId.toString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-200/30">
                            <div className="font-bold text-muted-foreground mb-2 text-sm flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Description
                            </div>
                            <div className="text-sm leading-relaxed">{nft.metadata.description}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur-lg opacity-10"></div>
                <div className="relative w-32 h-32 mx-auto bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <Hash className="h-16 w-16 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4 font-poppins">🎨 No NFTs Yet</h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                You haven't minted any NFTs yet. Start creating your amazing digital collection!
              </p>
              <Badge variant="outline" className="text-lg px-6 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
                ✨ Visit the Mint NFT tab to get started
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
