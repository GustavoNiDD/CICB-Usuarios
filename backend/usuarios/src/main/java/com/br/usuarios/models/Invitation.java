// src/main/java/com/br/usuarios/models/Invitation.java
package com.br.usuarios.models;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

/**
 * Entidade que representa um convite de cadastro no MongoDB.
 */
@Document(collection = "invitations")
@Data
@Builder
public class Invitation {

    public enum InvitationStatus {
        PENDING, // O convite foi enviado e está aguardando o usuário.
        ACCEPTED, // O usuário aceitou o convite e se cadastrou.
        EXPIRED   // O convite não foi aceito dentro do prazo.
    }

    @Id
    private String id;

    // Email da pessoa que está sendo convidada.
    @Indexed(unique = true)
    private String email;

    // O papel que o usuário terá ao se cadastrar.
    private Role role;

    // Token único e seguro que será enviado no link do convite.
    @Indexed(unique = true)
    private String token;

    // Data de validade do convite.
    private Instant expiresAt;

    // Status atual do convite.
    private InvitationStatus status;
}
