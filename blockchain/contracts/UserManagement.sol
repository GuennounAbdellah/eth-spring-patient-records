// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserManagement {
    address public owner;
    
    struct User {
        string userId;
        address wallet;
        bool isDoctor;
        bool isAdmin;
        bool isActive;
        uint256 createdAt;
    }

    mapping(string => User) public users;
    mapping(address => string) public walletToUserId;

    event UserRegistered(string userId, address wallet, bool isDoctor, bool isAdmin);
    event UserStatusChanged(string userId, bool isActive);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(userId).length > 0, "User not registered");
        require(users[userId].isAdmin, "Only admins can call this function");
        require(users[userId].isActive, "User account is not active");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Register the owner as the first admin
        users["owner"] = User("owner", msg.sender, false, true, true, block.timestamp);
        walletToUserId[msg.sender] = "owner";
        emit UserRegistered("owner", msg.sender, false, true);
    }

    function registerUser(
        string memory userId,
        address wallet,
        bool isDoctor,
        bool isAdmin
    ) public onlyAdmin returns (bool) {
        require(bytes(userId).length > 0, "userId is required");
        require(wallet != address(0), "Valid wallet address is required");
        require(bytes(users[userId].userId).length == 0, "User already exists");
        require(bytes(walletToUserId[wallet]).length == 0, "Wallet already registered");
        
        users[userId] = User({
            userId: userId,
            wallet: wallet,
            isDoctor: isDoctor,
            isAdmin: isAdmin,
            isActive: true,
            createdAt: block.timestamp
        });
        
        walletToUserId[wallet] = userId;
        emit UserRegistered(userId, wallet, isDoctor, isAdmin);
        return true;
    }

    function setUserStatus(string memory userId, bool isActive) 
        public 
        onlyAdmin 
        returns (bool) 
    {
        require(bytes(userId).length > 0, "userId is required");
        require(bytes(users[userId].userId).length > 0, "User does not exist");
        users[userId].isActive = isActive;
        emit UserStatusChanged(userId, isActive);
        return true;
    }

    // New getter function for testing
    function getUser(string memory userId) public view returns (User memory) {
        require(bytes(users[userId].userId).length > 0, "User does not exist");
        return users[userId];
    }
}