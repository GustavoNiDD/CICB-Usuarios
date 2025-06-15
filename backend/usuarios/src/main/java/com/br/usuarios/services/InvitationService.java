// src/main/java/com/br/usuarios/services/InvitationService.java
package com.br.usuarios.services;

import com.br.usuarios.models.Invitation;
import com.br.usuarios.models.Role;
import com.br.usuarios.repositories.InvitationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

/**
 * Serviço para gerenciar a lógica de negócio dos convites de cadastro.
 */
@Service
@RequiredArgsConstructor
public class InvitationService {

    private final InvitationRepository invitationRepository;

    /**
     * Cria um novo convite para um usuário.
     *
     * @param email O e-mail do usuário a ser convidado.
     * @param role O papel que o usuário terá após o cadastro.
     * @return O objeto Invitation que foi criado e salvo.
     */
    public Invitation createInvitation(String email, Role role) {
        // Gera um token universalmente único e seguro.
        String token = UUID.randomUUID().toString();

        // Define a data de validade do convite (ex: 7 dias a partir de agora).
        Instant expirationDate = Instant.now().plus(7, ChronoUnit.DAYS);

        Invitation invitation = Invitation.builder()
                .email(email)
                .role(role)
                .token(token)
                .expiresAt(expirationDate)
                .status(Invitation.InvitationStatus.PENDING)
                .build();

        // Salva o convite no banco de dados.
        return invitationRepository.save(invitation);
    }

    /**
     * Valida um token de convite.
     *
     * @param token O token a ser validado.
     * @return Um Optional contendo o convite se ele for válido, ou um Optional vazio caso contrário.
     */
    public Optional<Invitation> validateInvitation(String token) {
        Optional<Invitation> optionalInvitation = invitationRepository.findByToken(token);

        if (optionalInvitation.isEmpty()) {
            return Optional.empty(); // Convite não encontrado.
        }

        Invitation invitation = optionalInvitation.get();

        // Verifica se o convite ainda está pendente e se não expirou.
        if (invitation.getStatus() != Invitation.InvitationStatus.PENDING ||
            invitation.getExpiresAt().isBefore(Instant.now())) {
            
            // Opcional: Marcar o convite como expirado se for o caso.
            if (invitation.getStatus() == Invitation.InvitationStatus.PENDING) {
                invitation.setStatus(Invitation.InvitationStatus.EXPIRED);
                invitationRepository.save(invitation);
            }
            return Optional.empty(); // Convite inválido ou expirado.
        }

        return Optional.of(invitation);
    }
    
    /**
     * Marca um convite como aceito.
     *
     * @param invitation O convite que foi utilizado com sucesso.
     */
     public void markInvitationAsAccepted(Invitation invitation) {
        invitation.setStatus(Invitation.InvitationStatus.ACCEPTED);
        invitationRepository.save(invitation);
     }
}
