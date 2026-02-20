package com.challenge.clientes.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import static com.challenge.clientes.config.CorrelationIdFilter.CORRELATION_ID;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MicroserviceException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(
            MicroserviceException ex,
            HttpServletRequest request) {

        String correlationId = MDC.get(CORRELATION_ID);

        log.error("Business error [{}]: ", correlationId, ex);

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(ex.getStatus())
                .error("BusinessError")
                .errorCode(ex.getErrorCode())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .correlationId(correlationId)
                .build();

        return ResponseEntity.status(ex.getStatus()).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        String correlationId = MDC.get(CORRELATION_ID);

        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));

        log.error("Validation error [{}]: {}", correlationId, errors);

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(400)
                .error("ValidationError")
                .errorCode("VALIDATION_001")
                .message(errors)
                .path(request.getRequestURI())
                .correlationId(correlationId)
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(
            Exception ex,
            HttpServletRequest request) {

        String correlationId = MDC.get(CORRELATION_ID);

        log.error("Unexpected error [{}]: ", correlationId, ex);

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(500)
                .error("InternalServerError")
                .errorCode("GENERIC_500")
                .message("Error interno del servidor")
                .path(request.getRequestURI())
                .correlationId(correlationId)
                .build();

        return ResponseEntity.internalServerError().body(response);
    }
}