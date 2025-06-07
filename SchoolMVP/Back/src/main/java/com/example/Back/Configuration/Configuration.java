package com.example.Back.Configuration;

import com.example.Back.Component.JwtFilter;
import com.example.Back.Services.CusUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@org.springframework.context.annotation.Configuration
@EnableWebSecurity
public class Configuration {
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
                                .requestMatchers("/admins/**").hasAuthority("ADMIN")
                                .requestMatchers("/teachers/**").hasAuthority("TEACHER")
                                .requestMatchers("/parents/**").hasAuthority("PARENT")
                                .anyRequest().authenticated())
                                .userDetailsService(userDetailsService)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
@Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder(12);
    }
}
