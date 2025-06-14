package com.br.usuarios.repositories;

import com.br.usuarios.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório Spring Data JPA para a entidade User.
 * Abstrai o acesso ao banco de dados, fornecendo métodos CRUD (Create, Read, Update, Delete)
 * e a capacidade de definir consultas personalizadas de forma declarativa.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Busca um usuário pelo seu UID (identificador único) do Firebase.
     * Este é o método principal para sincronizar e encontrar usuários
     * que foram autenticados externamente pelo Firebase.
     *
     * @param uid O UID único do Firebase.
     * @return um Optional contendo o usuário, se ele for encontrado no banco de dados local.
     */
    Optional<User> findByUid(String uid);

    /**
     * Verifica de forma eficiente se um usuário com um determinado email já existe.
     * Pode ser útil para lógicas de negócio específicas antes de uma operação.
     *
     * @param email O email do usuário a ser verificado.
     * @return true se um usuário com o email especificado já existir, false caso contrário.
     */
    boolean existsByEmail(String email);
}
