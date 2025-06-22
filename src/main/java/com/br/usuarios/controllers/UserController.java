// Altere este arquivo:
// src/main/java/com/br/usuarios/controllers/UserController.java
package com.br.usuarios.controllers;

// Importe o novo DTO de detalhes
import com.br.usuarios.dtos.UserDetailsDto;
import com.br.usuarios.mappers.UserMapper;
import com.br.usuarios.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    // O tipo de retorno agora é o nosso DTO de detalhes
    public ResponseEntity<UserDetailsDto> getCurrentUser(@AuthenticationPrincipal String uid) {
        log.info(">>> UserController: Requisição recebida para /api/users/me para o UID: {}", uid);

        return userService.findByUid(uid)
                .map(user -> {
                    log.info(">>> UserController: Usuário encontrado: {}", user.getEmail());
                    // --- AQUI ESTÁ A MUDANÇA ---
                    // Usamos o novo método do mapper para converter para o DTO de saída detalhado.
                    return userMapper.toDetailsDto(user);
                })
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn(">>> UserController: Usuário não encontrado para UID: {}", uid);
                    return ResponseEntity.notFound().build();
                });
    }
}