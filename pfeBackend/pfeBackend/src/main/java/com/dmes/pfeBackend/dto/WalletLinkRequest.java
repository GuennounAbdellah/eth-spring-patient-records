package com.dmes.pfeBackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class WalletLinkRequest {
    @NotBlank
    @Pattern(regexp = "^0x[a-fA-F0-9]{40}$", message = "Invalid Ethereum address format")
    private String walletAddress;

}

