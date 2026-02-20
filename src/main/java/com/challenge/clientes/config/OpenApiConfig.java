package com.challenge.clientes.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI clientesApiInfo() {
        return new OpenAPI()
                .info(new Info()
                        .title("Clientes API")
                        .description("API REST para gestión de clientes - Challenge Intuit/Yappa")
                        .version("1.0.0"));
    }
}