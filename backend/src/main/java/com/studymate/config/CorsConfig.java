package com.studymate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration CORS (Cross-Origin Resource Sharing).
 *
 * Le problème : par sécurité, un navigateur interdit à une page venue d'une
 * "origine" (localhost:5173, notre front) de lire les réponses d'une autre
 * origine (localhost:8080, notre API). Sans cette config, toutes les requêtes
 * du front échouent avec l'erreur "blocked by CORS policy".
 *
 * La solution : le serveur déclare les origines auxquelles il fait confiance.
 * Le navigateur interroge d'abord le serveur ("requête preflight" OPTIONS),
 * lit cette autorisation, puis laisse passer les vraies requêtes.
 */
@Configuration // classe de configuration Spring, scannée au démarrage
public class CorsConfig {

    // @Bean : cette méthode fabrique un objet que Spring place dans son
    // conteneur (comme les composants @Service, mais construit à la main).
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // s'applique à toute notre API
                        // uniquement le front de dev — en production on mettra
                        // l'URL réelle du site (via une variable d'environnement)
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PATCH", "PUT", "DELETE");
            }
        };
    }
}
