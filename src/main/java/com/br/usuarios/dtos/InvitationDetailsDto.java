// Crie este novo arquivo se ainda não o fez:
// src/main/java/com/br/usuarios/dtos/InvitationDetailsDto.java
package com.br.usuarios.dtos;

import com.br.usuarios.models.Role;

public record InvitationDetailsDto(String email, Role role) {}