// src/main/java/com/br/usuarios/dtos/UserDto.java
package com.br.usuarios.dtos;

import com.br.usuarios.models.Role;

/**
 * DTO (Data Transfer Object) para transferir dados de usuário de e para a API.
 * Isola a entidade de banco de dados da exposição externa, uma prática de segurança essencial.
 * Usar um 'record' Java torna o código mais conciso e garante imutabilidade.
 *
 * @param uid O UID do Firebase, identificador público e seguro.
 * @param email O email do usuário.
 * @param name O nome do usuário.
 * @param role O papel do usuário no sistema.
 */
public record UserDto(String uid, String email, String name, Role role) {
}