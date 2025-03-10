// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const HospitalConsultation = await ethers.getContractFactory("HospitalConsultation");
    const hospitalConsultation = await HospitalConsultation.deploy();
    await hospitalConsultation.deployed();
    console.log("HospitalConsultation deployed to:", hospitalConsultation.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });