// src/main/java/com/br/usuarios/config/SecurityConfig.java
package com.br.usuarios.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuração central do Spring Security para definir as regras de segurança da aplicação.
 */
@Configuration
@EnableWebSecurity // Habilita a integração do Spring Security com o Spring MVC.
@EnableMethodSecurity(securedEnabled = true) // Habilita anotações de segurança em métodos, como @Secured.
@RequiredArgsConstructor
public class SecurityConfig {

    private final FirebaseTokenFilter firebaseTokenFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Desabilita CSRF, pois a API é stateless e usa tokens, o que já previne esse tipo de ataque.
                .csrf(csrf -> csrf.disable())
                
                // 2. Define a política de sessão como STATELESS. O servidor não criará ou manterá sessões HTTP.
                // Cada requisição deve conter toda a informação necessária para ser processada (o token).
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // 3. Configura as regras de autorização para as requisições HTTP.
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/public/**").permitAll() // Permite acesso a qualquer endpoint em /public sem autenticação.
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Exige o papel 'ADMIN'.
                        .requestMatchers("/api/professor/**").hasAnyRole("ADMIN", "PROFESSOR") // Exige 'ADMIN' OU 'PROFESSOR'.
                        .requestMatchers("/api/aluno/**").hasAnyRole("ADMIN", "PROFESSOR", "ALUNO") // Exige qualquer papel.
                        .anyRequest().authenticated() // Exige autenticação para todas as outras requisições.
                )
                
                // 4. Adiciona nosso filtro customizado de validação de token do Firebase
                // ANTES do filtro padrão de autenticação de usuário e senha do Spring.
                .addFilterBefore(firebaseTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}