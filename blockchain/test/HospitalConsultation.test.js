require("@nomiclabs/hardhat-waffle"); 
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HospitalConsultation", function () {
  let hospitalConsultation;
  let owner, admin, doctor, patient;

  beforeEach(async function () {
    [owner, admin, doctor, patient] = await ethers.getSigners();
    const HospitalConsultation = await ethers.getContractFactory("HospitalConsultation");
    hospitalConsultation = await HospitalConsultation.deploy();
    await hospitalConsultation.deployed();

    // Register the admin user (owner is already admin via constructor)
    await hospitalConsultation.connect(owner).registerUser(
      "admin123", // userId
      admin.address, // wallet
      false, // isDoctor
      true // isAdmin
    );
  });

  async function registerUser(userId, wallet, isDoctor, isAdmin) {
    await hospitalConsultation.connect(admin).registerUser(
      userId,
      wallet,
      isDoctor,
      isAdmin
    );
  }

  it("Should register a user", async function () {
    const NEW_USER_ID = "patient321";
    const NEW_USER_WALLET = patient.address;

    await registerUser(NEW_USER_ID, NEW_USER_WALLET, false, false);

    const user = await hospitalConsultation.getUser(NEW_USER_ID);
    expect(user.wallet).to.equal(NEW_USER_WALLET);
    expect(user.isAdmin).to.be.false;
  });

  it("Should fail to register a duplicate user", async function () {
    await registerUser("patient321", patient.address, false, false);
    await expect(
      registerUser("patient321", patient.address, false, false)
    ).to.be.revertedWith("User already exists");
  });

  it("Should add a consultation", async function () {
    await registerUser("doctor123", doctor.address, true, false);
    await registerUser("patient123", patient.address, false, false);

    await hospitalConsultation.connect(patient).grantAccess(
      "patient123",
      "doctor123",
      0
    );

    await hospitalConsultation.connect(doctor).addConsultation(
      "patient123",
      "Encrypted details",
      "Metadata"
    );

    const consultations = await hospitalConsultation.getPatientConsultations(
      "patient123",
      "patient123",
      0, // start
      10 // limit
    );

    expect(consultations.length).to.equal(1);
    expect(consultations[0].details).to.equal("Encrypted details");
  });

  it("Should fail to add consultation without permission", async function () {
    await registerUser("doctor123", doctor.address, true, false);
    await registerUser("patient123", patient.address, false, false);

    await expect(
      hospitalConsultation.connect(doctor).addConsultation(
        "patient123",
        "Encrypted details",
        "Metadata"
      )
    ).to.be.revertedWith("Doctor does not have permission");
  });

  it("Should allow emergency access to read consultations", async function () {
    await registerUser("doctor123", doctor.address, true, false);
    await registerUser("patient123", patient.address, false, false);

    // Add a consultation with permission
    await hospitalConsultation.connect(patient).grantAccess(
      "patient123",
      "doctor123",
      0
    );
    await hospitalConsultation.connect(doctor).addConsultation(
      "patient123",
      "Encrypted details",
      "Metadata"
    );

    // Enable emergency mode and revoke normal access
    await hospitalConsultation.connect(admin).toggleEmergencyMode(true);
    await hospitalConsultation.connect(admin).setEmergencyAccessor(doctor.address, true);
    await hospitalConsultation.connect(patient).removeAccess("patient123", "doctor123");

    // Verify emergency access allows reading
    const consultations = await hospitalConsultation.connect(doctor).getPatientConsultations(
      "patient123",
      "doctor123", // Doctor is emergency accessor
      0, // start
      10 // limit
    );
    expect(consultations.length).to.equal(1);
  });

  it("Should handle pagination in getPatientConsultations", async function () {
    await registerUser("doctor123", doctor.address, true, false);
    await registerUser("patient123", patient.address, false, false);

    await hospitalConsultation.connect(patient).grantAccess("patient123", "doctor123", 0);

    // Add multiple consultations
    await hospitalConsultation.connect(doctor).addConsultation("patient123", "Details 1", "Meta 1");
    await hospitalConsultation.connect(doctor).addConsultation("patient123", "Details 2", "Meta 2");
    await hospitalConsultation.connect(doctor).addConsultation("patient123", "Details 3", "Meta 3");

    // Get first page (limit 2)
    const page1 = await hospitalConsultation.getPatientConsultations("patient123", "patient123", 0, 2);
    expect(page1.length).to.equal(2);
    expect(page1[0].details).to.equal("Details 1");
    expect(page1[1].details).to.equal("Details 2");

    // Get second page
    const page2 = await hospitalConsultation.getPatientConsultations("patient123", "patient123", 2, 2);
    expect(page2.length).to.equal(1);
    expect(page2[0].details).to.equal("Details 3");
  });
});