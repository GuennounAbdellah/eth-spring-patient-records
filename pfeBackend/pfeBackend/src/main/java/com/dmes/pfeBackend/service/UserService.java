ackage com.dmes.pfeBackend.service;

import com.healthcare.blockchain.dto.RegistrationRequest;
import com.healthcare.blockchain.dto.UserStatusUpdateRequest;
import com.healthcare.blockchain.model.Role;
import com.healthcare.blockchain.model.User;
import com.healthcare.blockchain.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ContractService contractService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, ContractService contractService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.contractService = contractService;
    }

    @Transactional
    public User registerUser(RegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        try {
            user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + request.getRole());
        }

        return userRepository.save(user);
    }

    @Transactional
    public User linkWallet(String userId, String walletAddress) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setWalletAddress(walletAddress);
        User savedUser = userRepository.save(user);

        // Register user on blockchain
        contractService.registerUser(userId, walletAddress)
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to register user on blockchain", ex);
                });

        return savedUser;
    }

    @Transactional
    public User updateUserStatus(UserStatusUpdateRequest request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(request.getIsActive());
        User savedUser = userRepository.save(user);

        // Update user status on blockchain
        contractService.setUserStatus(request.getUserId(), request.getIsActive())
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to update user status on blockchain", ex);
                });

        return savedUser;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }
}
