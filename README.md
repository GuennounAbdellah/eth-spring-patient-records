# EthSpringHealth - Decentralized Patient Records Management System

EthSpringHealth is a decentralized system for managing patient records securely and transparently using blockchain technology. It leverages Ethereum smart contracts, Spring Boot for the backend, and a modern React-based frontend to provide a robust and user-friendly platform for healthcare data management.

---

## Features

###  **Blockchain Integration**
- Patient records are stored securely using Ethereum smart contracts.
- Immutable and transparent data storage ensures trust and accountability.

###  **Spring Boot Backend**
- RESTful API for seamless interaction with the blockchain.
- Role-based access control for patients, doctors, and administrators.
- Secure authentication and authorization using JWT.

###  **React Frontend**
- User-friendly interface for patients, doctors, and administrators.
- Role-specific dashboards for managing medical records, consultations, and permissions.

###  **Web3j Integration**
- Java wrapper for interacting with Ethereum smart contracts.
- Supports operations like granting/revoking access, adding consultations, and managing permissions.

###  **Healthcare-Specific Features**
- **Patient Features**:
  - View and manage personal medical records.
  - Grant/revoke access to doctors.
- **Doctor Features**:
  - Access patient records with granted permissions.
  - Add consultations securely.
- **Admin Features**:
  - Manage users (patients, doctors, and admins).
  - Monitor blockchain transactions for auditing purposes.

---

## Tech Stack

### Backend
- **Spring Boot**: REST API and business logic.
- **MySQL**: Relational database for user and metadata storage.
- **Web3j**: Ethereum blockchain integration.
- **JWT**: Secure authentication and authorization.

### Frontend
- **React**: Modern UI framework for building interactive user interfaces.
- **Axios**: HTTP client for API communication.
- **React Router**: Navigation and routing.

### Blockchain
- **Ethereum**: Decentralized platform for smart contracts.
- **Ganache**: Local Ethereum blockchain for development and testing.
- **Solidity**: Smart contract programming language.


## Role of Blockchain in the Application
The blockchain is used to ensure **data immutability**, **transparency**, and **security** for patient records. It stores critical operations such as granting/revoking access and adding consultations, ensuring that all actions are traceable and tamper-proof.

---

## Role of MySQL in the Application
MySQL serves as the **primary relational database** for storing user profiles, metadata, and non-critical information. It complements the blockchain by handling data that does not require immutability, such as user credentials, roles, and additional profile details.