package com.PrepEdgeAi.PrepEdge.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * This configuration class defines shared beans for the application.
 */
@Configuration
public class AppConfig {

    /**
     * Creates the RestTemplate bean.
     * Spring will create this single object and inject it wherever a
     * RestTemplate is required (e.g., in GeminiProvider and GPTProvider).
     * This method SOLVES the "RestTemplate that could not be found" error.
     *
     * @return A singleton RestTemplate instance.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Creates the ObjectMapper bean.
     * This is used for converting Java objects to/from JSON. It will be
     * needed by your providers as well.
     *
     * @return A singleton ObjectMapper instance.
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}