// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HospitalConsultation {
    struct Consultation {
        string patientId;
        string doctorId;
        string data;
    }

    mapping(uint => Consultation) public consultations;
    uint public consultationCount;
    mapping(address => bool) public authorizedHospitals;

    modifier onlyAuthorized() {
        require(authorizedHospitals[msg.sender], "Unauthorized hospital");
        _;
    }

    constructor() {
        authorizedHospitals[msg.sender] = true; // Deployer is authorized
    }

    function addHospital(address hospital) public onlyAuthorized {
        authorizedHospitals[hospital] = true;
    }

    function addConsultation(string memory _patientId, string memory _doctorId, string memory _data) public onlyAuthorized {
        consultationCount++;
        consultations[consultationCount] = Consultation(_patientId, _doctorId, _data);
    }

    function getConsultation(uint _id) public view returns (string memory, string memory, string memory) {
        Consultation memory c = consultations[_id];
        return (c.patientId, c.doctorId, c.data);
    }
}