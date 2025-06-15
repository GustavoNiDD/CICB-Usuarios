// src/main/java/com/br/usuarios/controllers/InvitationController.java
package com.br.usuarios.controllers;

import com.br.usuarios.dtos.InvitationRequestDto;
import com.br.usuarios.models.Invitation;
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
    // Futuramente, injetaríamos aqui um EmailService para enviar o e-mail.

    /**
     * Endpoint para criar e enviar um convite de cadastro.
     * Graças à nossa configuração de segurança, a anotação @Secured agora
     * usa o nome do papel diretamente, sem o prefixo "ROLE_".
     *
     * @param invitationRequest DTO contendo o e-mail e o papel do convidado.
     * @return Uma resposta de sucesso.
     */
    @PostMapping
    @Secured("ADMIN") // O código fica mais limpo e intuitivo.
    public ResponseEntity<Void> createInvitation(@RequestBody InvitationRequestDto invitationRequest) {
        Invitation invitation = invitationService.createInvitation(
            invitationRequest.email(),
            invitationRequest.role()
        );

        // TODO: Lógica para enviar o e-mail.
        // Aqui é onde você chamaria um serviço de e-mail para enviar o link
        // de convite para o usuário.
        // Ex: emailService.sendInvitationEmail(invitation.getEmail(), invitation.getToken());

        System.out.println("Convite criado para: " + invitation.getEmail() + " com o token: " + invitation.getToken());

        return ResponseEntity.ok().build();
    }
}
