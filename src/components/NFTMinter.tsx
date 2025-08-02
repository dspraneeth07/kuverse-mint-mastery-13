
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, CheckCircle, Info } from 'lucide-react';
import { useNFTContract } from '@/hooks/useNFTContract';
import { useWeb3 } from '@/hooks/useWeb3';
import { toast } from 'sonner';

export const NFTMinter = () => {
  const { isConnected } = useWeb3();
  const { mintNFT, isMinting, mintingStatus } = useNFTContract();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rarity: '',
    image: ''
  });
  const [justMinted, setJustMinted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Log form changes for debugging
    console.log('📝 Form updated:', { field, value, formData: { ...formData, [field]: value } });
  };

  const generateTokenURI = (data: typeof formData) => {
    // In a real application, you would upload metadata to IPFS
    // For demo purposes, we'll create a simple JSON metadata
    const metadata = {
      name: data.name,
      description: data.description,
      image: data.image || `https://via.placeholder.com/400x400?text=${encodeURIComponent(data.name)}`,
      attributes: [
        {
          trait_type: "Rarity",
          value: data.rarity
        },
        {
          trait_type: "Collection",
          value: "Kuverse"
        },
        {
          trait_type: "Creator",
          value: "Kuverse Platform"
        }
      ]
    };
    
    console.log('🎯 Generated metadata:', metadata);
    // In production, upload to IPFS and return the hash
    return `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.rarity) errors.push('Rarity is required');
    
    if (formData.name.length > 100) errors.push('Name must be less than 100 characters');
    if (formData.description.length > 500) errors.push('Description must be less than 500 characters');
    
    return errors;
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Minting started with form data:', formData);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(', '));
      return;
    }

    try {
      setJustMinted(false);
      const tokenURI = generateTokenURI(formData);
      
      console.log('📤 Calling mintNFT with:', {
        name: formData.name.trim(),
        description: formData.description.trim(),
        rarity: formData.rarity,
        tokenURI
      });
      
      await mintNFT(
        formData.name.trim(),
        formData.description.trim(),
        formData.rarity,
        tokenURI
      );
      
      // Reset form and show success state
      setFormData({
        name: '',
        description: '',
        rarity: '',
        image: ''
      });
      
      setJustMinted(true);
      toast.success('NFT minted successfully! Check your profile to see it.');
      
      // Reset success state after 5 seconds
      setTimeout(() => setJustMinted(false), 5000);
      
    } catch (error) {
      console.error('❌ Minting error:', error);
      toast.error('Failed to mint NFT. Please try again.');
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'text-yellow-600';
      case 'epic': return 'text-purple-600';
      case 'rare': return 'text-blue-600';
      case 'common': return 'text-gray-600';
      default: return 'text-primary';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return '👑';
      case 'epic': return '💜';
      case 'rare': return '💎';
      case 'common': return '⚪';
      default: return '✨';
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Please connect your wallet to mint NFTs
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Mint Your NFT
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          Create your unique digital collectible with custom metadata
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleMint} className="space-y-4">
          <div>
            <Label htmlFor="name" className="flex items-center gap-2">
              Name * 
              <span className="text-xs text-muted-foreground">({formData.name.length}/100)</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter NFT name (e.g., My Awesome NFT)"
              required
              disabled={isMinting}
              maxLength={100}
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="flex items-center gap-2">
              Description *
              <span className="text-xs text-muted-foreground">({formData.description.length}/500)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your NFT (e.g., This is a unique digital collectible)"
              required
              disabled={isMinting}
              maxLength={500}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="rarity">Rarity *</Label>
            <Select 
              value={formData.rarity} 
              onValueChange={(value) => handleInputChange('rarity', value)}
              disabled={isMinting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rarity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Common" className="flex items-center">
                  <span className="flex items-center gap-2">
                    <span>⚪</span> Common
                  </span>
                </SelectItem>
                <SelectItem value="Rare" className="flex items-center">
                  <span className="flex items-center gap-2">
                    <span>💎</span> Rare
                  </span>
                </SelectItem>
                <SelectItem value="Epic" className="flex items-center">
                  <span className="flex items-center gap-2">
                    <span>💜</span> Epic
                  </span>
                </SelectItem>
                <SelectItem value="Legendary" className="flex items-center">
                  <span className="flex items-center gap-2">
                    <span>👑</span> Legendary
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {formData.rarity && (
              <p className={`text-xs mt-1 ${getRarityColor(formData.rarity)}`}>
                {getRarityIcon(formData.rarity)} Selected: {formData.rarity}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="image">Image URL (Optional)</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://example.com/image.png"
              disabled={isMinting}
              type="url"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to use a generated placeholder image
            </p>
          </div>
          
          {/* Form Preview */}
          {(formData.name || formData.description || formData.rarity) && (
            <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
              <h4 className="font-semibold text-sm mb-2">NFT Preview:</h4>
              <div className="space-y-1 text-sm">
                {formData.name && <div><strong>Name:</strong> {formData.name}</div>}
                {formData.description && <div><strong>Description:</strong> {formData.description.substring(0, 100)}{formData.description.length > 100 ? '...' : ''}</div>}
                {formData.rarity && <div><strong>Rarity:</strong> {getRarityIcon(formData.rarity)} {formData.rarity}</div>}
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isMinting || !formData.name || !formData.description || !formData.rarity}
            size="lg"
          >
            {isMinting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting NFT...
              </>
            ) : justMinted ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                NFT Minted Successfully!
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Mint NFT
              </>
            )}
          </Button>
          
          {mintingStatus && (
            <div className="text-center text-sm text-muted-foreground mt-2 p-3 bg-muted/50 rounded-lg">
              {mintingStatus}
            </div>
          )}
          
          {justMinted && (
            <div className="text-center text-sm text-green-600 mt-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              🎉 Your NFT has been minted! Visit the Profile tab to see your new NFT with all its metadata in your collection.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
