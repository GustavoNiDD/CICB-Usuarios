// Crie este novo arquivo:
// src/main/java/com/br/usuarios/controllers/AdminController.java
package com.br.usuarios.controllers;

import com.br.usuarios.dtos.UserCreationDto;
import com.br.usuarios.dtos.UserDetailsDto;
import com.br.usuarios.mappers.UserMapper;
import com.br.usuarios.models.User;
import com.br.usuarios.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.net.URI;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAuthority('ADMIN')") // Garante que apenas admins acessem
public class AdminController {

    private final UserService userService;
    private final UserMapper userMapper;

    /**
     * Endpoint para criar um novo usuário com detalhes completos.
     * Recebe um UserCreationDto com todas as informações necessárias.
     *
     * @param userCreationDto O corpo da requisição com os dados do usuário.
     * @return Um ResponseEntity com o status 201 (Created) e os detalhes do usuário criado,
     * ou um status de erro em caso de falha.
     */
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserCreationDto userCreationDto) {
        try {
            // 1. Chama o serviço para executar a lógica de negócio
            User createdUser = userService.createUser(userCreationDto);

            // 2. Mapeia a entidade retornada para o DTO de saída
            UserDetailsDto responseDto = userMapper.toDetailsDto(createdUser);

            // 3. Retorna uma resposta 201 Created com a localização e o corpo do novo recurso
            URI location = URI.create("/api/users/" + responseDto.getUid());
            return ResponseEntity.created(location).body(responseDto);

        } catch (Exception e) {
            log.error("Erro ao criar usuário: {}", e.getMessage());
            // Retorna um 409 Conflict se o usuário já existir, ou 400 para outros erros.
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}