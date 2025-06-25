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
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
@Slf4j
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        
        log.debug(">>> FirebaseTokenFilter: Processando requisição {} {}", method, requestURI);
        
        // Permitir requisições OPTIONS (CORS preflight)
        if ("OPTIONS".equals(method)) {
            log.debug(">>> FirebaseTokenFilter: Permitindo requisição OPTIONS (CORS preflight)");
            filterChain.doFilter(request, response);
            return;
        }
        
        // Permitir endpoints públicos sem autenticação
        if (requestURI.startsWith("/public/") || requestURI.equals("/public")) {
            log.debug(">>> FirebaseTokenFilter: Permitindo endpoint público: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }
        
        String header = request.getHeader("Authorization");
        
        if (header == null || !header.startsWith("Bearer ")) {
            log.debug(">>> FirebaseTokenFilter: Sem token de autorização, continuando sem autenticação");
            filterChain.doFilter(request, response);
            return;
        }

        String idToken = header.substring(7);
        log.debug(">>> FirebaseTokenFilter: Token encontrado, verificando...");

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            User user = userService.processFirebaseUser(decodedToken);
            
            // MUDANÇA AQUI: Não adicionamos mais o prefixo "ROLE_"
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().name());
            
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user.getUid(),
                    null,
                    Collections.singletonList(authority));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.debug(">>> FirebaseTokenFilter: Usuário autenticado: {} com role: {}", user.getUid(), user.getRole());

        } catch (FirebaseAuthException e) {
            log.warn(">>> FirebaseTokenFilter: Erro na verificação do token: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            // Não bloquear a requisição, apenas continuar sem autenticação
            filterChain.doFilter(request, response);
            return;
        } catch (Exception e) {
            log.error(">>> FirebaseTokenFilter: Erro inesperado: {}", e.getMessage(), e);
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
