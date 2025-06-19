// src/main/java/com/br/usuarios/controllers/UserController.java
package com.br.usuarios.controllers;

import com.br.usuarios.dtos.UserDto;
import com.br.usuarios.mappers.UserMapper;
import com.br.usuarios.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
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

        log.info(">>> UserController: Requisição recebida para /api/users/me");
        log.info(">>> UserController: UID do usuário autenticado: {}", uid);
        
        System.out.println(">>> UserController: Requisição recebida para /api/users/me");
        System.out.println(">>> UserController: UID do usuário autenticado: " + uid);
        
        return userService.findByUid(uid)
                .map(user -> {
                    log.info(">>> UserController: Usuário encontrado: {}", user.getEmail());
                    return userMapper.toDto(user);
                })
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn(">>> UserController: Usuário não encontrado para UID: {}", uid);
                    return ResponseEntity.notFound().build();
                });
    }
}