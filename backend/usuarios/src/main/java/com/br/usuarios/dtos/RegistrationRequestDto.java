// src/main/java/com/br/usuarios/dtos/RegistrationRequestDto.java
package com.br.usuarios.dtos;

/**
 * DTO para receber os dados de uma requisição de registro via convite.
 *
 * @param firebaseIdToken O ID Token JWT gerado pelo Firebase após o login/cadastro do usuário.
 * @param invitationToken O token único gerado pelo nosso sistema e enviado no link do convite.
 */
public record RegistrationRequestDto(String firebaseIdToken, String invitationToken) {
}
