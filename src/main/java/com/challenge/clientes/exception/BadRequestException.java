package com.challenge.clientes.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends MicroserviceException {

    public BadRequestException(String errorCode, String message) {
        super(errorCode, message, HttpStatus.BAD_REQUEST.value());
    }
}