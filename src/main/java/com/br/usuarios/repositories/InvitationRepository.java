// src/main/java/com/br/usuarios/repositories/InvitationRepository.java
package com.br.usuarios.repositories;

import com.br.usuarios.models.Invitation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório Spring Data para a coleção de convites no MongoDB.
 */
@Repository
public interface InvitationRepository extends MongoRepository<Invitation, String> {

    /**
     * Busca um convite pelo seu token único.
     *
     * @param token O token do convite a ser encontrado.
     * @return um Optional contendo o convite, se ele for válido e encontrado.
     */
    Optional<Invitation> findByToken(String token);
}
