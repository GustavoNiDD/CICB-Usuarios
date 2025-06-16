// src/main/java/com/br/usuarios/services/UserService.java
package com.br.usuarios.services;

import com.br.usuarios.models.Invitation;
import com.br.usuarios.models.Role;
import com.br.usuarios.models.User;
import com.br.usuarios.repositories.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final InvitationService invitationService; // Nova dependência

    /**
     * Processa o login de um usuário já existente ou o cadastro
     * de um novo usuário SEM convite (padrão ALUNO).
     */
    @Transactional
    public User processFirebaseUser(FirebaseToken decodedToken) {
        return userRepository.findByUid(decodedToken.getUid()).orElseGet(() -> {
            User newUser = User.builder()
                    .uid(decodedToken.getUid())
                    .email(decodedToken.getEmail())
                    .name(decodedToken.getName())
                    .role(Role.ALUNO) // Papel padrão para quem se cadastra sem convite.
                    .build();
            return userRepository.save(newUser);
        });
    }

    /**
     * Registra um novo usuário no sistema a partir de um convite.
     * Este é o novo fluxo principal para cadastros autorizados.
     *
     * @param firebaseIdToken O token do Firebase do novo usuário.
     * @param invitationToken O token do convite que ele usou.
     * @return O usuário recém-criado.
     * @throws Exception se o convite, o token ou os dados forem inválidos.
     */
    @Transactional
    public User registerNewUser(String firebaseIdToken, String invitationToken) throws Exception {
        // 1. Valida se o convite existe, não foi usado e não expirou.
        Invitation invitation = invitationService.validateInvitation(invitationToken)
            .orElseThrow(() -> new Exception("Convite inválido ou expirado."));

        // 2. Valida o token do Firebase para garantir a identidade do usuário.
        FirebaseToken decodedToken;
        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(firebaseIdToken);
        } catch (FirebaseAuthException e) {
            throw new Exception("Token do Firebase inválido.");
        }

        // 3. Garante que o usuário se cadastrou com o mesmo e-mail do convite.
        if (!decodedToken.getEmail().equalsIgnoreCase(invitation.getEmail())) {
            throw new Exception("O e-mail do convite não corresponde ao e-mail da conta de login.");
        }

        // 4. Garante que o usuário ainda não está cadastrado.
        if (userRepository.existsByEmail(decodedToken.getEmail())) {
            throw new Exception("Usuário já cadastrado no sistema.");
        }

        // 5. Cria o novo usuário com o papel (Role) definido no convite.
        User newUser = User.builder()
                .uid(decodedToken.getUid())
                .email(decodedToken.getEmail())
                .name(decodedToken.getName())
                .role(invitation.getRole()) // A Role vem do convite!
                .build();
        userRepository.save(newUser);

        // 6. Marca o convite como "aceito" para que não possa ser usado novamente.
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
