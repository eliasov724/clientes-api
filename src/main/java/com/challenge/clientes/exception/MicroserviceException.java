package com.challenge.clientes.exception;

import lombok.Getter;

@Getter
public abstract class MicroserviceException extends RuntimeException {

    private final String errorCode;
    private final int status;

    protected MicroserviceException(String errorCode, String message, int status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }
}