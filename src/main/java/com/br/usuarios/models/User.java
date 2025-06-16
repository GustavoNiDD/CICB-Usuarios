// src/main/java/com/br/usuarios/models/User.java
package com.br.usuarios.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Entidade que representa um usuário no MongoDB.
 * A anotação @Document mapeia esta classe para uma coleção no banco.
 */
@Document(collection = "users") // Mapeia para a coleção "users" no MongoDB
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id; // No MongoDB, o ID é tipicamente uma String (ObjectId)

    // UID do Firebase, usado como identificador único para sincronização.
    // @Indexed(unique = true) garante que não haverá UIDs duplicados.
    @Indexed(unique = true)
    private String uid;

    @Indexed(unique = true)
    private String email;

    private String name;

    // O Enum é salvo como uma String no documento.
    private Role role;
}