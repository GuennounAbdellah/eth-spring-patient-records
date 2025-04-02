const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  const HospitalConsultation = await hre.ethers.getContractFactory("HospitalConsultation");
  const hospitalConsultation = await HospitalConsultation.deploy();

  console.log("Contract deployed to:", hospitalConsultation.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });