package com.example.Back.Component;

import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;

import java.util.stream.Collectors;
import java.util.stream.DoubleStream;

@Component
public class JwtUtil {

    private final String secretKeyBase64 = "aGZpd2hmaWhkaXNoZWlzaHJpd2ZiamRic2plaHVpcmh1aWRzbmZqcWVpaGZxZGY=";
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.startsWith("ROLE_") ? role.substring(5) : role)  // remove ROLE_ prefix
                .collect(Collectors.toList());

        claims.put("roles", roles);
        System.out.println("Generating token for: " + userDetails.getUsername());
        System.out.println("Authorities: " + userDetails.getAuthorities());
        System.out.println("User roles: " + roles);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 1000)) // 5 min expiration
                .signWith(getSigningKey())
                .compact();
    }

    // Extract username (subject) from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract roles list from token
    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        List<String> roles = claims.get("roles", List.class);
        return roles == null ? new ArrayList<>() : roles;
    }

    // Validate token with user details
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Check if token expired
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extract expiration date from token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract a specific claim using a resolver function
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Parse token and extract all claims
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Decode secret and return signing key
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKeyBase64);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}