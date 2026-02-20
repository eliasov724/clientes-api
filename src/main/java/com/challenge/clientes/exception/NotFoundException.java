package com.challenge.clientes.exception;

import org.springframework.http.HttpStatus;

public class NotFoundException extends MicroserviceException {

    public NotFoundException(String errorCode, String message) {
        super(errorCode, message, HttpStatus.NOT_FOUND.value());
    }
}