// src/main/java/com/br/usuarios/repositories/UserRepository.java
package com.br.usuarios.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.br.usuarios.models.Role;
import com.br.usuarios.models.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByUid(String uid);

    boolean existsByEmail(String email);
    
    // --- ADICIONE ESTE MÉTODO ---
    /**
     * Verifica de forma eficiente se um usuário com um determinado UID já existe.
     * O Spring Data gera a consulta por debaixo dos panos.
     *
     * @param uid O UID do Firebase a ser verificado.
     * @return true se um usuário com o UID especificado já existir, false caso contrário.
     */
    boolean existsByUid(String uid);

     // --- NOVO MÉTODO AQUI ---
    /**
     * Busca todos os usuários que possuem um determinado papel (role).
     */
    List<User> findByRole(Role role);
}