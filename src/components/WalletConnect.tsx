
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, LogOut, Copy, Check, AlertCircle, Download, ExternalLink, Play } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { toast } from 'sonner';

export const WalletConnect = () => {
  const { 
    address, 
    isConnected, 
    connectWallet, 
    connectMockWallet,
    disconnectWallet, 
    formatAddress, 
    isPending, 
    error, 
    isMetaMaskInstalled,
    mockMode 
  } = useWeb3();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-cyan-950/20">
        <CardHeader className="text-center pb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Wallet className="h-8 w-8" />
            </div>
            Connect Your Wallet
          </CardTitle>
          <p className="text-purple-100 mt-2 text-lg">
            Join the Kuverse NFT ecosystem
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {/* Demo Mode Button */}
          <div className="space-y-4">
            <Button 
              onClick={connectMockWallet}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <Play className="h-6 w-6 mr-2" />
              <span>Try Demo Mode</span>
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse ml-2"></div>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Perfect for screenshots & demos - no wallet needed!
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">Or connect real wallet</span>
            </div>
          </div>
          
          {!isMetaMaskInstalled ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                <Download className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="font-semibold text-orange-800 dark:text-orange-200">MetaMask Required</p>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    Install MetaMask to connect your wallet
                  </p>
                </div>
              </div>
              <Button 
                onClick={installMetaMask}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Install MetaMask
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                    Connection failed. Please try again or refresh the page.
                  </p>
                </div>
              )}
              <Button 
                onClick={connectWallet} 
                disabled={isPending}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                {isPending ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Wallet className="h-6 w-6" />
                    <span>Connect MetaMask</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </Button>
            </>
          )}
          
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Secure • Decentralized • Your Keys, Your NFTs
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20">
      <CardHeader className="pb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold">
                {mockMode ? 'Demo Mode' : 'Connected'}
              </span>
              <p className="text-green-100 text-sm font-normal">
                {mockMode ? 'Prototype Active' : 'Wallet Active'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
            className="bg-white/10 border-white/20 text-white hover:bg-red-500/20 hover:text-white hover:border-red-300"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        {mockMode && (
          <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <Play className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">Demo Mode Active</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-300">
                Perfect for screenshots and presentations!
              </p>
            </div>
          </div>
        )}
        
        <div className="relative">
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-green-200 dark:border-green-800 shadow-inner">
            <div className="flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Your Address</p>
              <span className="font-mono text-lg font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                {formatAddress(address!)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="ml-4 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-xl"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              Ready to Mint NFTs!
            </p>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            {mockMode ? 'Demo wallet connected to Kuverse' : 'Your wallet is connected to the Kuverse ecosystem'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
