// SUBSTITUA O CONTEÚDO DESTE ARQUIVO:
// Caminho: src/main/java/com/br/usuarios/controllers/RegistrationController.java
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
     * NOVO ENDPOINT: Verifica a validade de um token de convite.
     * O frontend chamará isso antes de renderizar o formulário de registro.
     * @param token O token do convite vindo da URL.
     * @return Os detalhes do convite (email e papel) se for válido.
     */
    @GetMapping("/validate/{token}")
    public ResponseEntity<InvitationDetailsDto> validateInvitation(@PathVariable String token) {
        return invitationService.validateInvitation(token)
                .map(invitation -> new InvitationDetailsDto(invitation.getEmail(), invitation.getRole()))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Convite inválido, expirado ou já utilizado."));
    }

    /**
     * ENDPOINT ATUALIZADO: Finaliza o registro do usuário.
     * Agora recebe um DTO com todos os detalhes do perfil do formulário.
     *
     * @param creationDto O DTO com todos os dados do usuário do formulário.
     * @return Os dados do usuário recém-criado.
     */
    @PostMapping
    public ResponseEntity<UserDetailsDto> register(@RequestBody UserCreationDto creationDto) {
        try {
            // A chamada agora é para o nosso serviço robusto que sabe criar usuários completos
            User newUser = userService.createUser(creationDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toDetailsDto(newUser));
        } catch (Exception e) {
            // A validação de UID/Email duplicado já acontece dentro de createUser.
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}