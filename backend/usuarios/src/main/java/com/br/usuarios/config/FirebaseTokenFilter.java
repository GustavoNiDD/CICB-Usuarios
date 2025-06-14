// src/main/java/com/br/usuarios/config/FirebaseTokenFilter.java
package com.br.usuarios.config;

import com.br.usuarios.models.User;
import com.br.usuarios.services.UserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Filtro de segurança customizado que é executado uma vez por requisição para validar o ID Token do Firebase.
 * Este é o coração da integração entre o Firebase Auth e o Spring Security.
 */
@Component
@RequiredArgsConstructor
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        // Se o cabeçalho 'Authorization' não existir ou não começar com "Bearer ",
        // a requisição é passada para o próximo filtro na cadeia sem autenticação.
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String idToken = header.substring(7); // Extrai o token, removendo o prefixo "Bearer ".

        try {
            // Usa o Firebase Admin SDK para verificar a assinatura e a validade do token.
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            
            // Usa nosso UserService para sincronizar/buscar o usuário no banco de dados local.
            User user = userService.processFirebaseUser(decodedToken);
            
            // Cria a autoridade (ROLE) para o Spring Security. O prefixo "ROLE_" é uma convenção.
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
            
            // Cria o objeto de autenticação que o Spring Security usará.
            // O UID do usuário é usado como 'principal'. A senha (credentials) é nula, pois a verificação já foi feita.
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user.getUid(),
                    null,
                    Collections.singletonList(authority));

            // Define o usuário como autenticado no contexto de segurança do Spring.
            // A partir daqui, o Spring Security sabe quem é o usuário e qual é o seu papel.
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (FirebaseAuthException e) {
            // Se o token for inválido (expirado, malformado, etc.), limpa o contexto
            // e retorna um erro 403 (Forbidden), impedindo o acesso.
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token Firebase inválido ou expirado.");
            return;
        }

        // Continua a execução para o próximo filtro na cadeia.
        filterChain.doFilter(request, response);
    }
}