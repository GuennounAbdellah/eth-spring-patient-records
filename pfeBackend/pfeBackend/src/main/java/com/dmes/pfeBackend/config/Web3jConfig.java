package com.dmes.pfeBackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;

@Configuration
public class Web3jConfig {

    @Value("${web3j.contract.ganache-url:http://localhost:7545}")
    private String ganacheUrl;

    @Value("${web3j.wallet.private-key:0x}")
    private String privateKey;

    @Value("${web3j.contract.gas-limit:6721975}")
    private long gasLimit;
    
    @Value("${web3j.contract.gas-price:20000000000}")
    private long gasPrice;

    @Value("${web3j.contract.address:}")
    private String contractAddress;

    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService(ganacheUrl));
    }

    @Bean
    public Credentials credentials() {
    	if (privateKey.startsWith("0x")) {
    	    privateKey = privateKey.substring(2);
    	}
        return Credentials.create(privateKey);
    }

    @Bean
    public ContractGasProvider gasProvider() {
        return new StaticGasProvider(
            java.math.BigInteger.valueOf(gasPrice), 
            java.math.BigInteger.valueOf(gasLimit)
        );
    }
    
    @Bean
    public String contractAddress() {
        return contractAddress;
    }
}