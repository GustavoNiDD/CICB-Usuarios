// src/main/java/com/br/usuarios/services/EmailService.java
package com.br.usuarios.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // Injeta a URL do front-end a partir do application.properties para ser mais flexível
    @Value("${app.frontend.url}")
    private String frontendUrl;

    /**
     * Envia um e-mail de convite para um novo usuário.
     * @param to O endereço de e-mail do destinatário.
     * @param token O token único do convite.
     */
    public void sendInvitationEmail(String to, String token) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            // O helper facilita a criação de e-mails, incluindo suporte a HTML e anexos.
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            // Constrói o link completo para a página de registro do seu front-end
            String invitationLink = frontendUrl + "/register?token=" + token;

            // Cria uma mensagem HTML bonita para o e-mail.
            String htmlMsg = "<h3>Você foi convidado para se juntar à nossa plataforma!</h3>" +
                             "<p>Por favor, clique no link abaixo para completar seu cadastro:</p>" +
                             "<a href=\"" + invitationLink + "\" style=\"background-color:#4CAF50;color:white;padding:15px 25px;text-align:center;text-decoration:none;display:inline-block;border-radius:8px;font-size:16px;\">Aceitar Convite</a>" +
                             "<p style=\"margin-top:20px;\">Se você não solicitou este convite, por favor, ignore este e-mail.</p>";

            helper.setText(htmlMsg, true); // O 'true' indica que o conteúdo do e-mail é HTML.
            helper.setTo(to);
            helper.setSubject("Você foi convidado para o CICB!");
            helper.setFrom("nao-responda@cicb.com"); // Pode ser um e-mail genérico do seu sistema.

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            // Em uma aplicação real, você deveria logar este erro de forma mais robusta
            // usando um framework de logging como o SLF4J.
            throw new RuntimeException("Falha ao enviar e-mail de convite.", e);
        }
    }
}
