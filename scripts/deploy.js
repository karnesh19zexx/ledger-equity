const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Starting deployment to Sepolia...");
  
  // Deploy DonationPlatform
  console.log("\n📝 Deploying DonationPlatform contract...");
  const DonationPlatform = await hre.ethers.getContractFactory("DonationPlatform");
  const donationPlatform = await DonationPlatform.deploy();
  await donationPlatform.waitForDeployment();
  const donationAddress = await donationPlatform.getAddress();
  console.log("✅ DonationPlatform deployed to:", donationAddress);
  
  // Deploy DonationNFT
  console.log("\n📝 Deploying DonationNFT contract...");
  const DonationNFT = await hre.ethers.getContractFactory("DonationNFT");
  const donationNFT = await DonationNFT.deploy();
  await donationNFT.waitForDeployment();
  const nftAddress = await donationNFT.getAddress();
  console.log("✅ DonationNFT deployed to:", nftAddress);
  
  // Deploy SchoolPool
  console.log("\n📝 Deploying SchoolPool contract...");
  const SchoolPool = await hre.ethers.getContractFactory("SchoolPool");
  const schoolPool = await SchoolPool.deploy();
  await schoolPool.waitForDeployment();
  const poolAddress = await schoolPool.getAddress();
  console.log("✅ SchoolPool deployed to:", poolAddress);
  
  // Save contract addresses
  const addresses = {
    donationPlatform: donationAddress,
    donationNFT: nftAddress,
    schoolPool: poolAddress,
    network: "sepolia",
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "contracts-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  
  console.log("\n📄 Contract addresses saved to contracts-addresses.json");
  
  // Add sample data
  console.log("\n🌱 Adding sample schools and students...");
  
  // Add School 1
  const tx1 = await donationPlatform.addSchool(
    "Sunshine Primary School",
    "Nairobi, Kenya",
    -1286389, // -1.286389 * 1000000 for precision
    36817223, // 36.817223 * 1000000
    await donationPlatform.owner()
  );
  await tx1.wait();
  console.log("✅ Added Sunshine Primary School");
  
  // Add School 2
  const tx2 = await donationPlatform.addSchool(
    "Hope Valley School",
    "Mumbai, India",
    19075984, // 19.075984 * 1000000
    72877656, // 72.877656 * 1000000
    await donationPlatform.owner()
  );
  await tx2.wait();
  console.log("✅ Added Hope Valley School");
  
  // Add School 3
  const tx3 = await donationPlatform.addSchool(
    "Future Stars Academy",
    "Lagos, Nigeria",
    6524379, // 6.524379 * 1000000
    3379206, // 3.379206 * 1000000
    await donationPlatform.owner()
  );
  await tx3.wait();
  console.log("✅ Added Future Stars Academy");
  
  // Add Students
  const students = [
    {
      name: "Amara Johnson",
      location: "Nairobi, Kenya",
      lat: -1286389,
      lng: 36817223,
      needs: "Textbooks, School uniform, Internet access",
      target: hre.ethers.parseEther("0.5"),
      schoolId: 1
    },
    {
      name: "Rahul Patel",
      location: "Mumbai, India",
      lat: 19075984,
      lng: 72877656,
      needs: "Laptop, Online course subscription, Study materials",
      target: hre.ethers.parseEther("0.8"),
      schoolId: 2
    },
    {
      name: "Chioma Okafor",
      location: "Lagos, Nigeria",
      lat: 6524379,
      lng: 3379206,
      needs: "Science lab equipment, Books, School supplies",
      target: hre.ethers.parseEther("0.6"),
      schoolId: 3
    },
    {
      name: "Priya Sharma",
      location: "Mumbai, India",
      lat: 19075984,
      lng: 72877656,
      needs: "Art supplies, Music instruments, Sports equipment",
      target: hre.ethers.parseEther("0.4"),
      schoolId: 2
    }
  ];
  
  for (let student of students) {
    const tx = await donationPlatform.addStudent(
      student.name,
      student.location,
      student.lat,
      student.lng,
      student.needs,
      student.target,
      await donationPlatform.owner(),
      student.schoolId
    );
    await tx.wait();
    console.log(`✅ Added student: ${student.name}`);
  }
  
  // Create sample school pools
  console.log("\n🏊 Creating school funding pools...");
  
  const pool1 = await schoolPool.createPool(
    1,
    "Sunshine Primary School",
    "New Computer Lab - 20 computers for digital literacy",
    hre.ethers.parseEther("5"),
    30 // 30 days
  );
  await pool1.wait();
  console.log("✅ Created pool for Computer Lab");
  
  const pool2 = await schoolPool.createPool(
    2,
    "Hope Valley School",
    "Library Expansion - 1000 new books and reading materials",
    hre.ethers.parseEther("3"),
    45
  );
  await pool2.wait();
  console.log("✅ Created pool for Library Expansion");
  
  console.log("\n✨ Deployment complete!");
  console.log("\n📋 Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("DonationPlatform:", donationAddress);
  console.log("DonationNFT:", nftAddress);
  console.log("SchoolPool:", poolAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n💡 Next steps:");
  console.log("1. Update your .env file with these addresses");
  console.log("2. Run: npm run dev");
  console.log("3. Connect MetaMask to Sepolia testnet");
  console.log("4. Get test ETH from https://sepoliafaucet.com/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
