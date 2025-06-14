package com.br.usuarios.services;

import com.br.usuarios.models.Role;
import com.br.usuarios.models.User;
import com.br.usuarios.repositories.UserRepository;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Serviço que encapsula a lógica de negócio para o gerenciamento de usuários.
 * Esta classe atua como uma ponte entre os controladores (controllers) e os repositórios (repositories).
 */
@Service
@RequiredArgsConstructor // Injeta as dependências (final) via construtor, graças ao Lombok.
public class UserService {

    private final UserRepository userRepository;

    /**
     * Processa um usuário autenticado pelo Firebase.
     * <p>
     * Se o usuário (identificado pelo UID do token) não existir no banco de dados local,
     * ele é criado com um papel padrão (Role.ALUNO) e salvo.
     * Se ele já existir, seus dados são simplesmente retornados.
     * A anotação @Transactional garante que a operação de verificação-e-criação seja atômica.
     *
     * @param decodedToken O token do Firebase já decodificado, contendo as informações do usuário (uid, email, etc.).
     * @return O usuário correspondente do banco de dados local (seja ele novo ou já existente).
     */
    @Transactional
    public User processFirebaseUser(FirebaseToken decodedToken) {
        String uid = decodedToken.getUid();

        // O método orElseGet é ideal aqui: a expressão lambda para criar um novo usuário
        // só será executada se o Optional retornado pelo findByUid estiver vazio.
        return userRepository.findByUid(uid).orElseGet(() -> {
            User newUser = User.builder()
                    .uid(uid)
                    .email(decodedToken.getEmail())
                    .name(decodedToken.getName())
                    .role(Role.ALUNO) // Define um papel padrão para todo novo usuário.
                    .build();
            return userRepository.save(newUser);
        });
    }

    /**
     * Delega a chamada para o repositório para buscar um usuário pelo seu UID.
     *
     * @param uid O UID do Firebase.
     * @return Um Optional contendo o usuário, se encontrado.
     */
    public Optional<User> findByUid(String uid) {
        return userRepository.findByUid(uid);
    }

    /**
     * Retorna uma lista de todos os usuários cadastrados no banco de dados local.
     *
     * @return Uma lista de todas as entidades User.
     */
    public List<User> findAll() {
        return userRepository.findAll();
    }
}
