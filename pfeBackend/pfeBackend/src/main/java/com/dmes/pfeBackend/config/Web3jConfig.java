package com.dmes.pfeBackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;
import org.web3j.tx.Contract;
import java.math.BigInteger;

@Configuration
public class Web3jConfig {
    
    @Value("${ethereum.node.url}")
    private String ethereumNodeUrl;
    
    @Value("${ethereum.gas.price}")
    private BigInteger gasPrice;
    
    @Value("${ethereum.gas.limit}")
    private BigInteger gasLimit;
    
    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService(ethereumNodeUrl));
    }
    
    @Bean
    public ContractGasProvider contractGasProvider() {
        return new StaticGasProvider(gasPrice, gasLimit);
    }
}