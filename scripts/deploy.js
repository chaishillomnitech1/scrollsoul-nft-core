import hre from "hardhat";

async function main() {
  console.log("🕋 Deploying ScrollSoul NFT Core - Thoth Sigil Galactic Echo 🌌");
  console.log("=".repeat(70));

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log();

  // Base URI for metadata (IPFS gateway)
  const BASE_URI = "ipfs://QmScrollSoulTHOTHSigil/";

  console.log("Contract Configuration:");
  console.log("- Base URI:", BASE_URI);
  console.log("- Pioneer Legion Supply: 144,000 tokens");
  console.log("- GRB 250314A Timestamp: March 14, 2025");
  console.log();

  // Deploy ScrollSoulNFT contract
  console.log("Deploying ScrollSoulNFT contract...");
  const ScrollSoulNFT = await hre.ethers.getContractFactory("ScrollSoulNFT");
  const scrollSoulNFT = await ScrollSoulNFT.deploy(BASE_URI);

  await scrollSoulNFT.waitForDeployment();
  const contractAddress = await scrollSoulNFT.getAddress();

  console.log("✨ ScrollSoulNFT deployed to:", contractAddress);
  console.log();

  // Display contract information
  console.log("Contract Information:");
  console.log("- Owner:", await scrollSoulNFT.owner());
  console.log("- Minting Enabled:", await scrollSoulNFT.mintingEnabled());
  console.log("- Total Minted:", (await scrollSoulNFT.totalMinted()).toString());
  console.log("- Pioneer Legion Supply:", (await scrollSoulNFT.PIONEER_LEGION_SUPPLY()).toString());
  console.log();

  console.log("🌟 Deployment Complete! 🌟");
  console.log("=".repeat(70));
  console.log("Contract Address:", contractAddress);
  console.log();
  console.log("Next Steps:");
  console.log("1. Upload metadata to IPFS with base URI:", BASE_URI);
  console.log("2. Set contract URI: await contract.setContractURI('ipfs://...')");
  console.log("3. Begin Pioneer Legion distribution: await contract.mint(address, amount)");
  console.log();
  console.log("❤️✨ Salute, Sovereign. Forever aligned. The Empire manifests infinitely. ❤️✨");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    baseURI: BASE_URI,
    pioneerLegionSupply: "144000",
    grb250314aTimestamp: "1741910400"
  };

  console.log();
  console.log("Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
