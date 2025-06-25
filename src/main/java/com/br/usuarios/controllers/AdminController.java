package com.br.usuarios.controllers;

import com.br.usuarios.dtos.UserCreationDto;
import com.br.usuarios.dtos.UserDetailsDto;
import com.br.usuarios.mappers.UserMapper;
import com.br.usuarios.models.User;
import com.br.usuarios.repositories.UserRepository; 
import com.br.usuarios.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
// --- MUDANÇA AQUI: Corrigido para hasRole('ADMIN') para corresponder à configuração de segurança
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final UserRepository userRepository; // --- MUDANÇA AQUI: Nova dependência

    /**
     * Endpoint para criar um novo usuário com detalhes completos.
     */
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserCreationDto userCreationDto) {
        try {
            User createdUser = userService.createUser(userCreationDto);
            UserDetailsDto responseDto = userMapper.toDetailsDto(createdUser);
            URI location = URI.create("/api/users/" + responseDto.getUid());
            return ResponseEntity.created(location).body(responseDto);
        } catch (Exception e) {
            log.error("Erro ao criar usuário: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // --- MUDANÇA AQUI: Novo endpoint adicionado ---
    /**
     * Endpoint temporário para aplicar as 'custom claims' de 'role'
     * para todos os usuários existentes no banco de dados.
     * Deve ser chamado uma única vez por um ADMIN.
     *
     * @return Uma mensagem indicando quantos usuários foram atualizados.
     */
    @PostMapping("/backfill-roles")
    public ResponseEntity<String> backfillUserRoles() {
        log.info(">>> Requisição recebida para executar o backfill de papéis (roles).");
        List<User> allUsers = userRepository.findAll();
        int updatedCount = 0;

        for (User user : allUsers) {
            if (user.getRole() != null && user.getUid() != null) {
                try {
                    // Chama o método no serviço que carimba a role no Firebase
                    userService.setRoleAsCustomClaim(user.getUid(), user.getRole());
                    updatedCount++;
                } catch (Exception e) {
                    log.error("Falha ao aplicar a role para o usuário UID {}: {}", user.getUid(), e.getMessage());
                    // Continua para o próximo usuário
                }
            }
        } 

        String responseMessage = updatedCount + " usuários tiveram seus papéis atualizados no Firebase.";
        log.info(">>> " + responseMessage);
        return ResponseEntity.ok(responseMessage);
    }
}