package com.challenge.clientes.controller;

import com.challenge.clientes.dto.ClienteRequest;
import com.challenge.clientes.dto.ClienteResponse;
import com.challenge.clientes.entity.Cliente;
import com.challenge.clientes.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.List;

@Tag(name = "Clientes", description = "Operaciones relacionadas con clientes")
@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService service;

    @Operation(summary = "Obtener todos los clientes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno")
    })
    @GetMapping
    public Page<ClienteResponse> getAll(

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.getAll(PageRequest.of(page, size));
    }


    @Operation(summary = "Obtener cliente por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
            @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    @GetMapping("/{id}")
    public Cliente getById(@PathVariable Long id) {
        return service.getById(id);
    }


    @Operation(summary = "Crear nuevo cliente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cliente creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Error de validación")
    })
    @PostMapping
    public ResponseEntity<ClienteResponse> create(
            @Valid @RequestBody ClienteRequest request) {

        ClienteResponse response = service.create(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Actualizar cliente")
    @PutMapping("/{id}")
    public ClienteResponse update(@PathVariable Long id,
                          @Valid @RequestBody ClienteRequest request) {
        return service.update(id, request);
    }

    @Operation(summary = "Eliminar cliente")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @Operation(summary = "Buscar clientes por apellido")
    @GetMapping("/search")
    public Page<ClienteResponse> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.search(q, PageRequest.of(page, size));
    }

}