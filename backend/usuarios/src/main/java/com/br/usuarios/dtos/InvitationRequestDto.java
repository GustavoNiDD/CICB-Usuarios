// src/main/java/com/br/usuarios/dtos/InvitationRequestDto.java
package com.br.usuarios.dtos;

import com.br.usuarios.models.Role;

/**
 * DTO para receber os dados de uma requisição de criação de convite.
 * Usar um DTO específico para a requisição garante que apenas os dados
 * necessários sejam recebidos e validados.
 *
 * @param email O e-mail da pessoa a ser convidada.
 * @param role  O papel que será atribuído ao usuário após o cadastro.
 */
public record InvitationRequestDto(String email, Role role) {
}
