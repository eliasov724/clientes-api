package com.challenge.clientes.mapper;

import com.challenge.clientes.dto.ClienteRequest;
import com.challenge.clientes.dto.ClienteResponse;
import com.challenge.clientes.entity.Cliente;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public Cliente toEntity(ClienteRequest request) {

        Cliente cliente = new Cliente();

        cliente.setNombre(request.getFirstName());
        cliente.setApellido(request.getLastName());
        cliente.setRazonSocial(request.getBusinessName());
        cliente.setCuit(request.getCuit());
        cliente.setFechaNacimiento(request.getFechaNacimiento());
        cliente.setTelefonoCelular(request.getMobilePhone());
        cliente.setEmail(request.getEmail());

        return cliente;
    }

    public ClienteResponse toResponse(Cliente c) {

        ClienteResponse dto = new ClienteResponse();

        dto.setId(c.getId());
        dto.setFirstName(c.getNombre());
        dto.setLastName(c.getApellido());
        dto.setBusinessName(c.getRazonSocial());
        dto.setCuit(c.getCuit());
        dto.setBirthDate(c.getFechaNacimiento());
        dto.setMobilePhone(c.getTelefonoCelular());
        dto.setEmail(c.getEmail());
        dto.setCreatedAt(c.getFechaCreacion());
        dto.setUpdatedAt(c.getFechaModificacion());

        return dto;
    }
}