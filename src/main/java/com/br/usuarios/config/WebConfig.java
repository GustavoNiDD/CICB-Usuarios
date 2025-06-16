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
            "http://localhost:19006/",
            "http://localhost:8081/",  // Sua origem frontend principal
            "exp://1cmgfxq-anonymous-8081.exp.direct",
            "exp://192.166.0.11:8081",
            "http://192.168.0.11:8080/",
            // ADICIONE A URL DA SUA APLICAÇÃO FRONTEND EM PRODUÇÃO NO HEROKU
            // Exemplo: "https://seu-app-frontend.herokuapp.com/"
            "https://pessoas-api-c5ef63b1acc3.herokuapp.com/" // IMPORTANTE: Se o frontend também estiver no Heroku, adicione a URL COMPLETA dele aqui.
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
