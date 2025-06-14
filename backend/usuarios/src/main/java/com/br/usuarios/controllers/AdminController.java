// src/main/java/com/br/usuarios/controllers/AdminController.java
package com.br.usuarios.controllers;

import com.br.usuarios.dtos.UserDto;
import com.br.usuarios.mappers.UserMapper;
import com.br.usuarios.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador com endpoints restritos que só podem ser acessados
 * por usuários com o papel (Role) de ADMIN.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final UserMapper userMapper;

    /**
     * Endpoint para listar todos os usuários cadastrados no sistema.
     * Somente um ADMIN pode ver a lista completa de usuários.
     * @return Uma lista de UserDto contendo os dados de todos os usuários.
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.findAll()
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/dashboard")
    public String getAdminDashboard() {
        return "Dados confidenciais do Dashboard do Administrador.";
    }
}