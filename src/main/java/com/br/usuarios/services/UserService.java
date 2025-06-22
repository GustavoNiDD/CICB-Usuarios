// src/main/java/com/br/usuarios/services/UserService.java
package com.br.usuarios.services;

import com.br.usuarios.dtos.UserCreationDto;
import com.br.usuarios.mappers.UserMapper;
import com.br.usuarios.models.*;
import com.br.usuarios.repositories.StudentDetailsRepository; // <-- NOVA IMPORTAÇÃO
import com.br.usuarios.repositories.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j // Adicionado para logs
public class UserService {

    private final UserRepository userRepository;
    private final InvitationService invitationService;

    // --- NOVAS DEPENDÊNCIAS ---
    private final StudentDetailsRepository studentDetailsRepository;
    private final UserMapper userMapper;

    /**
     * NOVO MÉTODO: Cria um usuário com detalhes completos a partir de um DTO.
     * Este método contém a lógica de orquestração para salvar entidades relacionadas.
     *
     * @param dto O DTO com todas as informações para criação do usuário.
     * @return A entidade User recém-criada e persistida.
     * @throws Exception se o email ou UID já existirem.
     */
    @Transactional
    public User createUser(UserCreationDto dto) throws Exception {
        log.info("Iniciando criação de usuário para o email: {}", dto.getEmail());

        // 1. Validações prévias para evitar conflitos
        if (userRepository.existsByUid(dto.getUid())) {
            throw new Exception("UID já cadastrado.");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new Exception("Email já cadastrado.");
        }

        // 2. Usa o Mapper para converter o DTO em uma entidade User (sem os detalhes do aluno)
        User user = userMapper.fromCreationDto(dto);

        // 3. Lógica de orquestração para papéis específicos (ALUNO)
        if (dto.getRole() == Role.ALUNO && dto.getStudentDetails() != null) {
            log.info("Usuário é um ALUNO. Processando detalhes de estudante...");
            
            // a. Cria a entidade StudentDetails a partir dos dados do DTO
            StudentDetails details = StudentDetails.builder()
                    .enrollmentId(dto.getStudentDetails().getEnrollmentId())
                    .parents(dto.getStudentDetails().getParents())
                    .build();

            // b. SALVA a entidade de detalhes PRIMEIRO para obter seu ID no MongoDB
            StudentDetails savedDetails = studentDetailsRepository.save(details);
            log.info("Detalhes de estudante salvos com ID: {}", savedDetails.getId());

            // c. ATRIBUI a referência dos detalhes salvos de volta ao objeto User
            user.setStudentDetails(savedDetails);
        }

        // 4. Salva a entidade User final, agora com todas as referências corretas
        User savedUser = userRepository.save(user);
        log.info("Usuário final salvo com ID: {}", savedUser.getId());
        
        return savedUser;
    }

    // --- SEUS MÉTODOS EXISTENTES (mantidos por enquanto) ---

    @Transactional
    public User processFirebaseUser(FirebaseToken decodedToken) {
        // Este método continua criando um usuário "mínimo".
        // Poderia ser adaptado no futuro para coletar mais detalhes.
        return userRepository.findByUid(decodedToken.getUid()).orElseGet(() -> {
            User newUser = User.builder()
                    .uid(decodedToken.getUid())
                    .email(decodedToken.getEmail())
                    .name(decodedToken.getName())
                    .role(Role.ALUNO)
                    .build();
            return userRepository.save(newUser);
        });
    }

    @Transactional
    public User registerNewUser(String firebaseIdToken, String invitationToken) throws Exception {
        // Validações do convite...
        Invitation invitation = invitationService.validateInvitation(invitationToken)
            .orElseThrow(() -> new Exception("Convite inválido ou expirado."));
        
        // Validações do Firebase...
        FirebaseToken decodedToken;
        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(firebaseIdToken);
        } catch (FirebaseAuthException e) {
            throw new Exception("Token do Firebase inválido.");
        }

        if (!decodedToken.getEmail().equalsIgnoreCase(invitation.getEmail())) {
            throw new Exception("O e-mail do convite não corresponde ao e-mail da conta de login.");
        }
        if (userRepository.existsByEmail(decodedToken.getEmail())) {
            throw new Exception("Usuário já cadastrado no sistema.");
        }

        // Este método também cria um usuário "mínimo".
        // O ideal seria que o fluxo de convite levasse a uma tela de "complete seu perfil"
        // que, ao ser submetida, chamaria nosso novo método createUser().
        User newUser = User.builder()
                .uid(decodedToken.getUid())
                .email(decodedToken.getEmail())
                .name(decodedToken.getName())
                .role(invitation.getRole())
                .build();
        userRepository.save(newUser);
        
        invitationService.markInvitationAsAccepted(invitation);
        
        return newUser;
    }

    public Optional<User> findByUid(String uid) {
        return userRepository.findByUid(uid);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }
}