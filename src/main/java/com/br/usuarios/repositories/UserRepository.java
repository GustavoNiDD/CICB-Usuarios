package com.br.usuarios.repositories;

import com.br.usuarios.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório Spring Data para a coleção de usuários no MongoDB.
 * A principal mudança aqui é a herança de MongoRepository em vez de JpaRepository.
 * Isso habilita a integração com o MongoDB, fornecendo métodos CRUD e a capacidade
 * de criar consultas derivadas a partir do nome do método, assim como no JPA.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> { // A chave primária (ID) do MongoDB é uma String

    /**
     * Busca um usuário pelo seu UID (identificador único) do Firebase.
     * O Spring Data MongoDB entende este nome de método e gera a consulta
     * ao campo 'uid' na coleção de usuários automaticamente.
     *
     * @param uid O UID único do Firebase.
     * @return um Optional contendo o usuário, se ele for encontrado.
     */
    Optional<User> findByUid(String uid);

    /**
     * Verifica de forma eficiente se um usuário com um determinado email já existe.
     *
     * @param email O email do usuário a ser verificado.
     * @return true se um usuário com o email especificado já existir, false caso contrário.
     */
    boolean existsByEmail(String email);
}
