package com.br.usuarios.controllers;

import com.br.usuarios.dtos.InvitationDetailsDto;
import com.br.usuarios.dtos.UserCreationDto;
import com.br.usuarios.dtos.UserDetailsDto;
import com.br.usuarios.mappers.UserMapper;
import com.br.usuarios.models.User;
import com.br.usuarios.services.InvitationService;
import com.br.usuarios.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Controlador público para lidar com o processo de registro de um usuário.
 */
@RestController
@RequestMapping("/public/register")
@RequiredArgsConstructor
public class RegistrationController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final InvitationService invitationService;

    /**
     * ENDPOINT AJUSTADO: Verifica a validade de um token de convite via Query Parameter.
     * O frontend chamará /public/register/validate?token=SEU_TOKEN, alinhado com o novo código.
     *
     * @param token O token do convite vindo da URL como um parâmetro de consulta.
     * @return Os detalhes do convite (email e papel) se for válido.
     */
    @GetMapping("/validate") // <-- MUDANÇA 1: O caminho não contém mais a variável.
    public ResponseEntity<InvitationDetailsDto> validateInvitation(@RequestParam String token) { // <-- MUDANÇA 2: A anotação mudou para @RequestParam.
        return invitationService.validateInvitation(token)
                .map(invitation -> new InvitationDetailsDto(invitation.getEmail(), invitation.getRole()))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Convite inválido, expirado ou já utilizado."));
    }

    /**
     * ENDPOINT ATUALIZADO: Finaliza o registro do usuário.
     * Agora recebe um DTO com todos os detalhes do perfil do formulário.
     *
     * @param creationDto O DTO com todos os dados do usuário, incluindo o 'invitationToken'.
     * @return Os dados do usuário recém-criado.
     */
    @PostMapping
    public ResponseEntity<UserDetailsDto> register(@RequestBody UserCreationDto creationDto) {
        // Lembre-se: O DTO `UserCreationDto` agora precisa ter o campo `private String invitationToken;`
        // para receber o token enviado pelo frontend.
        // A lógica para usar esse token e marcar o convite como "ACCEPTED" deve ser
        // implementada dentro do seu `userService.createUser(creationDto)`.
        try {
            User newUser = userService.createUser(creationDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toDetailsDto(newUser));
        } catch (Exception e) {
            // A validação de UID/Email duplicado já acontece dentro de createUser.
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}