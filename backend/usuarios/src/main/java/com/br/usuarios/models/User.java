// src/main/java/com/br/usuarios/model/User.java
package com.br.usuarios.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * Entidade JPA que representa um usuário no banco de dados local.
 * Esta tabela é sincronizada com os usuários do Firebase.
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // UID do Firebase, usado como identificador único para sincronização.
    @Column(unique = true, nullable = false, updatable = false)
    private String uid;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;

    // Define o papel do usuário para controle de acesso.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}