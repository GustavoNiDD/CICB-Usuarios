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
        System.out.println(">>> WebConfig: Aplicando mapeamentos CORS (incluindo Heroku)...");
        String[] allowedOrigins = {
            "http://localhost:19006/", // Para desenvolvimento Expo Web
            "http://localhost:8081/",  // Sua origem frontend principal de desenvolvimento
            "exp://1cmgfxq-anonymous-8081.exp.direct", // Exemplo de túnel Expo
            "exp://192.166.0.11:8081", // Exemplo de IP local para Expo LAN
            "http://192.168.0.11:8080/", // Se o app mobile usar o mesmo IP do backend
            "https://pessoas-api-c5ef63b1acc3.herokuapp.com/" // <<<<< AQUI ESTÁ A URL DO SEU BACKEND NO HEROKU
            // Adicione outras origens reais (seus domínios de frontend em produção/staging)
        };
        registry.addMapping("/*")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("")
                .allowCredentials(true);
        System.out.println(">>> WebConfig: Mapeamentos CORS aplicados para as seguintes origens: " +
                           String.join(", ", allowedOrigins));
    }
}
