package com.challenge.clientes.exception;

import org.springframework.http.HttpStatus;

public class DatabaseException extends MicroserviceException {

    public DatabaseException(String message) {
        super("DATABASE_500", message, HttpStatus.INTERNAL_SERVER_ERROR.value());
    }
}