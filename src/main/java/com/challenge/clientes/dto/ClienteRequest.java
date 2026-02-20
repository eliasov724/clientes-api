package com.challenge.clientes.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ClienteRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String businessName;

    @NotBlank
    @Pattern(regexp = "^(20|23|24|27|30|33|34)-\\d{8}-\\d$")
    private String cuit;


    @Past
    private LocalDate fechaNacimiento;

    @NotBlank
    @Pattern(
            regexp = "^\\d{2}-\\d{8}$",
            message = "Formato inválido. Debe ser XX-XXXXXXXX"
    )
    private String mobilePhone;

    @NotBlank
    @Email
    private String email;
}