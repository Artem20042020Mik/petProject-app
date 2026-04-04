package org.example.auth_clean.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter
{
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;
    public JwtAuthenticationFilter(JwtUtil jwtUtil, StringRedisTemplate redisTemplate){
        this.jwtUtil=jwtUtil;
        this.redisTemplate=redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException{
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring("Bearer ".length()).trim();

        try{
            String blacklistedToken = "blacklist:" +token;
            String blacklisted = redisTemplate.opsForValue().get(blacklistedToken);

            if (blacklisted !=  null){
                filterChain.doFilter(request,response);
                return;
            }
            DecodedJWT decodedJWT= jwtUtil.verifyToken(token);
            Long userId= decodedJWT.getClaim("userId").asLong();
            String role = decodedJWT.getClaim("role").asString();
            if (role==null) role = "ROLE_USER";
            var authorities = List.of(new SimpleGrantedAuthority(role));
            UsernamePasswordAuthenticationToken auth =new UsernamePasswordAuthenticationToken(
                    new JwtAuthUser(userId, role),
                    null,
                    authorities
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
            return;
        }
        filterChain.doFilter(request,response);
    }
    public record JwtAuthUser(Long userId, String role){}
}
