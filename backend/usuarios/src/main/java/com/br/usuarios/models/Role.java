// src/main/java/com/br/usuarios/model/Role.java
package com.br.usuarios.models;

/**
 * Enum para representar os papéis (roles) dos usuários no sistema.
 * O Spring Security adiciona o prefixo "ROLE_" automaticamente ao verificar as permissões.
 */
public enum Role {
    ADMIN,
    PROFESSOR,
    ALUNO
}
