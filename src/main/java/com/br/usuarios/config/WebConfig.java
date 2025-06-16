// Caminho: /home/gustavoadm/projetos/ColegioIntegracao/backend/usuarios/src/main/java/com/br/usuarios/config/WebConfig.java
package com.br.usuarios.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import javax.annotation.PostConstruct;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @PostConstruct
    public void init() {
        System.out.println(">>> WebConfig: Bean inicializado e carregado pelo Spring.");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println(">>> WebConfig: Aplicando mapeamentos CORS (origens explícitas)...");
        String[] allowedOrigins = {
            "http://localhost:19006", // Para desenvolvimento Expo Web (se usar porta 19006)
            "http://localhost:8081",  // Sua origem frontend principal
            "exp://1cmgfxq-anonymous-8081.exp.direct", // Se usar tunelamento Expo
            "exp://192.166.0.11:8081", // Seu IP na rede local para Expo LAN (verifique seu IP real no WSL ou no seu PC)
            "http://192.168.0.11:8080" // Se o app mobile usar o mesmo IP do backend como origem
            // ADICIONE QUALQUER OUTRA ORIGEM REAL QUE SEU FRONTEND POSSA TER
        };
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins) // AGORA COM AS ORIGENS ESPECÍFICAS
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // Mantenha como true se precisa de credenciais
        System.out.println(">>> WebConfig: Mapeamentos CORS aplicados para as seguintes origens: " +
                           String.join(", ", allowedOrigins));
    }
}