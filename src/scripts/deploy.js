
// Deployment script for Kuverse NFT Contract
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Kuverse NFT Contract...");

  // Get the ContractFactory and Signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy the contract
  const KuverseNFT = await ethers.getContractFactory("KuverseNFT");
  const kuverseNFT = await KuverseNFT.deploy();

  await kuverseNFT.deployed();

  console.log("✅ KuverseNFT deployed to:", kuverseNFT.address);
  
  // Verify deployment
  console.log("\n📋 Contract Details:");
  console.log("Contract Address:", kuverseNFT.address);
  console.log("Contract Name:", await kuverseNFT.name());
  console.log("Contract Symbol:", await kuverseNFT.symbol());
  console.log("Total Supply:", (await kuverseNFT.totalSupply()).toString());

  // Save deployment info
  const deploymentInfo = {
    contractAddress: kuverseNFT.address,
    deployer: deployer.address,
    blockNumber: kuverseNFT.deployTransaction.blockNumber,
    transactionHash: kuverseNFT.deployTransaction.hash,
    timestamp: new Date().toISOString()
  };

  console.log("\n💾 Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
  
  return kuverseNFT.address;
}

main()
  .then((address) => {
    console.log(`\n🎉 Deployment completed successfully!`);
    console.log(`📝 Update CONTRACT_ADDRESS in src/contracts/abi.ts to: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
