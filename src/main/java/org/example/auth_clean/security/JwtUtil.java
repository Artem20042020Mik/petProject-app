package org.example.auth_clean.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.auth0.jwt.algorithms.Algorithm;

import java.util.Date;
import java.time.Instant;

@Component
public class JwtUtil{
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.accessTokenTtlMinutes}")
    private long accessTokenTtl;

    @Value("${app.jwt.refreshTokenTtlDays}")
    private long refreshTokenTtl;

    private Algorithm algorithm(){
        return Algorithm.HMAC256(jwtSecret);
    }

    public String generateAccessToken(Long userId, String role, String email){
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(accessTokenTtl * 6);
        return JWT.create()
                .withIssuer("auth_clean")
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(exp))
                .withClaim("userId", userId)
                .withClaim("email", email)
                .withClaim("role", role)
                .sign(algorithm());
    }

    public String generateRefreshToken(Long userId){
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(refreshTokenTtl * 24 * 60 * 60);

        return JWT.create()
                .withIssuer("auth_clean")
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(exp))
                .withClaim("type", "refresh")
                .withClaim("userId", userId)
                .sign(algorithm());
    }


    public DecodedJWT verifyToken(String token) {
        JWTVerifier verifier = JWT.require(algorithm())
                .withIssuer("auth_clean")
                .build();
        return verifier.verify(token);
    }
}