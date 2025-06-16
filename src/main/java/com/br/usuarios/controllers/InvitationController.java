// src/main/java/com/br/usuarios/controllers/InvitationController.java
package com.br.usuarios.controllers;

import com.br.usuarios.dtos.InvitationRequestDto;
import com.br.usuarios.models.Invitation;
import com.br.usuarios.services.EmailService;
import com.br.usuarios.services.InvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para gerenciar o envio de convites de cadastro.
 * Protegido para ser acessível apenas por administradores.
 */
@RestController
@RequestMapping("/api/admin/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;
    private final EmailService emailService; // Injeta o novo serviço de e-mail

    /**
     * Endpoint para criar e enviar um convite de cadastro.
     * Este método agora completa o fluxo: cria o convite e envia o e-mail.
     *
     * @param invitationRequest DTO contendo o e-mail e o papel do convidado.
     * @return Uma resposta de sucesso.
     */
    @PostMapping
    @Secured("ADMIN")
    public ResponseEntity<Void> createInvitation(@RequestBody InvitationRequestDto invitationRequest) {
        // 1. Cria o registro do convite no banco de dados.
        Invitation invitation = invitationService.createInvitation(
            invitationRequest.email(),
            invitationRequest.role()
        );

        // 2. Envia o e-mail de convite para o usuário.
        emailService.sendInvitationEmail(invitation.getEmail(), invitation.getToken());

        return ResponseEntity.ok().build();
    }
}
