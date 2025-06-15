// src/main/java/com/br/usuarios/controllers/RegistrationController.java
package com.br.usuarios.controllers;

import com.br.usuarios.dtos.RegistrationRequestDto;
import com.br.usuarios.dtos.UserDto;
import com.br.usuarios.mappers.UserMapper;
import com.br.usuarios.models.User;
import com.br.usuarios.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Controlador público para lidar com o processo de registro final de um usuário
 * que se cadastrou através de um link de convite.
 */
@RestController
@RequestMapping("/public/register")
@RequiredArgsConstructor
public class RegistrationController {

    private final UserService userService;
    private final UserMapper userMapper;

    /**
     * Endpoint que o front-end chamará após o usuário se cadastrar
     * no Firebase (com e-mail/senha ou Google) usando um convite.
     *
     * @param request DTO contendo o ID Token do Firebase e o token do nosso convite.
     * @return Os dados do usuário recém-criado.
     */
    @PostMapping
    public ResponseEntity<UserDto> register(@RequestBody RegistrationRequestDto request) {
        try {
            User newUser = userService.registerNewUser(
                request.firebaseIdToken(),
                request.invitationToken()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toDto(newUser));
        } catch (Exception e) {
            // Em uma aplicação real, usaríamos um @ControllerAdvice para um tratamento de erro mais elegante.
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
