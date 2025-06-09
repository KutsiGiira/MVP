package com.example.Back.Configuration;

import com.example.Back.Component.JwtFilter;
import com.example.Back.Services.CusUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@org.springframework.context.annotation.Configuration
@EnableWebSecurity
public class Configuration implements WebMvcConfigurer {
    @Autowired
    JwtFilter jwtFilter;
    @Autowired
    private CusUserDetails userDetailsService;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http
                        .csrf(c -> c.disable())
                        .authorizeHttpRequests(req -> req
                            .requestMatchers("/new-user", "/login").permitAll()
                                .requestMatchers("/admins/**").hasRole("ADMIN")
                                .requestMatchers("/teachers/**").hasRole("TEACHER")
                                .requestMatchers("/parents/**").hasRole("PARENT")
                                .anyRequest().authenticated())
//                                .userDetailsService(userDetailsService) fach t9ad login page 7yd commnt
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:5173", "http://localhost:5174") hna dir endpoints dyal front
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
@Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder(12);
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
