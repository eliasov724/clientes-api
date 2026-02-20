package com.challenge.clientes.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class ClienteResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String businessName;

    private String cuit;

    private LocalDate birthDate;

    private String mobilePhone;

    private String email;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}