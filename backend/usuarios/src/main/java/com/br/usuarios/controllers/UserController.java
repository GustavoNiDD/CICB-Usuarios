// src/main/java/com/br/usuarios/controllers/UserController.java
package com.br.usuarios.controllers;

import com.br.usuarios.dtos.UserDto;
import com.br.usuarios.mappers.UserMapper;
import com.br.usuarios.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para endpoints gerais, acessíveis por qualquer usuário autenticado.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    /**
     * Retorna os detalhes do usuário atualmente autenticado.
     * A anotação @AuthenticationPrincipal injeta o "principal" do token,
     * que configuramos para ser o UID do Firebase.
     *
     * @param uid O UID do usuário, injetado pelo Spring Security.
     * @return Os dados do usuário logado em formato DTO.
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal String uid) {
        return userService.findByUid(uid)
                .map(userMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}