package com.challenge.clientes.service;

import com.challenge.clientes.dto.ClienteRequest;
import com.challenge.clientes.dto.ClienteResponse;
import com.challenge.clientes.entity.Cliente;
import com.challenge.clientes.exception.BadRequestException;
import com.challenge.clientes.exception.NotFoundException;
import com.challenge.clientes.mapper.ClienteMapper;
import com.challenge.clientes.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;
    private final ClienteMapper mapper;


    public Page<ClienteResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toResponse);
    }
    public Cliente getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("CLIENT_404", "Cliente no encontrado")
                );
    }
    public ClienteResponse create(ClienteRequest request) {

        if (repository.findByCuit(request.getCuit()).isPresent()) {
            throw new BadRequestException("CLIENT_001", "CUIT already exists");
        }

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("CLIENT_002", "Email already exists");
        }

        Cliente cliente = mapper.toEntity(request);

        cliente.setFechaCreacion(LocalDateTime.now());
        cliente.setFechaModificacion(LocalDateTime.now());

        Cliente saved = repository.save(cliente);

        return mapper.toResponse(saved);
    }
    public ClienteResponse update(Long id, ClienteRequest request) {

        Cliente cliente = getById(id);

        if (!cliente.getCuit().equals(request.getCuit()) &&
                repository.findByCuit(request.getCuit()).isPresent()) {
            throw new BadRequestException("CLIENT_001", "CUIT already exists");
        }

        if (!cliente.getEmail().equals(request.getEmail()) &&
                repository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("CLIENT_002", "Email already exists");
        }

        cliente.setNombre(request.getFirstName());
        cliente.setApellido(request.getLastName());
        cliente.setRazonSocial(request.getBusinessName());
        cliente.setCuit(request.getCuit());
        cliente.setFechaNacimiento(request.getFechaNacimiento());
        cliente.setTelefonoCelular(request.getMobilePhone());
        cliente.setEmail(request.getEmail());
        cliente.setFechaModificacion(LocalDateTime.now());

        Cliente updated = repository.save(cliente);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Page<ClienteResponse> search(String q, Pageable pageable) {

        List<Cliente> clientes = repository.searchClientes(q);

        List<ClienteResponse> responses = clientes
                .stream()
                .map(mapper::toResponse)
                .toList();

        return new PageImpl<>(responses, pageable, responses.size());
    }

}
