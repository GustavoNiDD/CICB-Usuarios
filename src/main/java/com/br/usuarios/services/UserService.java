// src/main/java/com/br/usuarios/services/UserService.java
package com.br.usuarios.services;

import java.util.List;
import java.util.Map; // --- MUDANÇA AQUI: Nova importação necessária ---
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.usuarios.dtos.UserCreationDto;
import com.br.usuarios.mappers.UserMapper;
import com.br.usuarios.models.Invitation;
import com.br.usuarios.models.Role;
import com.br.usuarios.models.StudentDetails;
import com.br.usuarios.models.User;
import com.br.usuarios.repositories.StudentDetailsRepository;
import com.br.usuarios.repositories.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final InvitationService invitationService;
    private final StudentDetailsRepository studentDetailsRepository;
    private final UserMapper userMapper;

    @Transactional
    public User createUser(UserCreationDto dto) throws Exception {
        log.info("Iniciando criação de usuário para o email: {}", dto.getEmail());

        if (userRepository.existsByUid(dto.getUid())) {
            throw new Exception("UID já cadastrado.");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new Exception("Email já cadastrado.");
        }

        User user = userMapper.fromCreationDto(dto);

        if (dto.getRole() == Role.ALUNO && dto.getStudentDetails() != null) {
            log.info("Usuário é um ALUNO. Processando detalhes de estudante...");
            StudentDetails details = StudentDetails.builder()
                    .enrollmentId(dto.getStudentDetails().getEnrollmentId())
                    .parents(dto.getStudentDetails().getParents())
                    .build();
            StudentDetails savedDetails = studentDetailsRepository.save(details);
            user.setStudentDetails(savedDetails);
        }

        User savedUser = userRepository.save(user);
        log.info("Usuário final salvo com ID: {}", savedUser.getId());

        // --- MUDANÇA AQUI: Chamando o método para carimbar o papel no token ---
        if (savedUser.getRole() != null) {
            setRoleAsCustomClaim(savedUser.getUid(), savedUser.getRole());
        }
        
        return savedUser;
    }

    @Transactional
    public User processFirebaseUser(FirebaseToken decodedToken) {
        return userRepository.findByUid(decodedToken.getUid()).orElseGet(() -> {
            User newUser = User.builder()
                    .uid(decodedToken.getUid())
                    .email(decodedToken.getEmail())
                    .name(decodedToken.getName())
                    .role(Role.ALUNO) // Define um papel padrão
                    .build();
            User savedUser = userRepository.save(newUser);

            // --- MUDANÇA AQUI: Carimbando o papel também neste fluxo de criação ---
            if (savedUser.getRole() != null) {
                setRoleAsCustomClaim(savedUser.getUid(), savedUser.getRole());
            }

            return savedUser;
        });
    }

    @Transactional
    public User registerNewUser(String firebaseIdToken, String invitationToken) throws Exception {
        Invitation invitation = invitationService.validateInvitation(invitationToken)
                .orElseThrow(() -> new Exception("Convite inválido ou expirado."));
        
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

        User newUser = User.builder()
                .uid(decodedToken.getUid())
                .email(decodedToken.getEmail())
                .name(decodedToken.getName())
                .role(invitation.getRole())
                .build();
        userRepository.save(newUser);
        
        // --- MUDANÇA AQUI: Carimbando o papel também no fluxo de registro por convite ---
        if (newUser.getRole() != null) {
            setRoleAsCustomClaim(newUser.getUid(), newUser.getRole());
        }
        
        invitationService.markInvitationAsAccepted(invitation);
        
        return newUser;
    }

    // --- MUDANÇA AQUI: Adicionando o novo método ---
    /**
     * Define o papel (role) do usuário como uma "Custom Claim" no Firebase Authentication.
     * Isso permite que outros microserviços leiam o papel diretamente do token,
     * tornando a autorização rápida e desacoplada.
     *
     * @param uid O UID do usuário no Firebase.
     * @param role O papel (ADMIN, PROFESSOR, etc.) a ser definido.
     */
    public void setRoleAsCustomClaim(String uid, Role role) {
        try {
            Map<String, Object> claims = Map.of("role", role.name());
            FirebaseAuth.getInstance().setCustomUserClaims(uid, claims);
            log.info("Papel '{}' carimbado com sucesso no token do usuário UID '{}'", role.name(), uid);
        } catch (FirebaseAuthException e) {
            log.error("Erro ao definir custom claim de papel para o UID '{}': {}", uid, e.getMessage());
            // Considere como tratar este erro. Lançar uma exceção pode ser apropriado
            // para garantir que a operação de criação não seja concluída sem a claim.
        }
    }

    public Optional<User> findByUid(String uid) {
        return userRepository.findByUid(uid);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    // --- NOVO MÉTODO AQUI ---
    /**
     * Busca usuários pelo seu papel (role).
     */
    public List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }
}
