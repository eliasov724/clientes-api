package com.challenge.clientes.repository;

import com.challenge.clientes.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {


    Optional<Cliente> findByCuit(String cuit);

    Optional<Cliente> findByEmail(String email);

    @Query(value = "SELECT * FROM sp_search_clientes(:q)", nativeQuery = true)
    List<Cliente> searchClientes(@Param("q") String q);


}