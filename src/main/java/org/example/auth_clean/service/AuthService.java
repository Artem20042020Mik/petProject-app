    package org.example.auth_clean.service;


    import com.auth0.jwt.interfaces.DecodedJWT;
    import org.example.auth_clean.model.User;
    import org.example.auth_clean.security.JwtUtil;
    import org.springframework.data.redis.core.StringRedisTemplate;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;

    import java.time.Duration;
    import java.util.Optional;

    @Service
    public class AuthService {
        private final UserService userService;
        private final JwtUtil jwtUtil;
        private final StringRedisTemplate redisTemplate;
        private final PasswordEncoder passwordEncoder;

        public AuthService(UserService userService, JwtUtil jwtUtil,
                           StringRedisTemplate redisTemplate, PasswordEncoder passwordEncoder){
            this.jwtUtil = jwtUtil;
            this.redisTemplate=redisTemplate;
            this.userService=userService;
            this.passwordEncoder=passwordEncoder;
        }

        public Optional<LoginResult> login(String email, String rawPassword){
            return userService.findByEmail(email)
                    .filter(user -> passwordEncoder.matches(rawPassword, user.getPassword()))
                    .map(user -> {
                        String accessToken = jwtUtil
                                .generateAccessToken(
                                        user.getId(),
                                        user.getRole().name(),
                                        user.getEmail());
                        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

                        DecodedJWT decoded = jwtUtil.verifyToken(refreshToken);
                        long secondsToLive = (decoded.getExpiresAt().getTime() - System.currentTimeMillis())/1000;

                        String redisKey = "refresh:" + refreshToken;
                        redisTemplate.opsForValue().set(redisKey,  user.getId().toString(), Duration.ofSeconds(secondsToLive));
                        return new LoginResult(accessToken, refreshToken);
                    });
        }

        public Optional<LoginResult> refresh(String oldRefreshToken){
            try{
                String token = normalizeToken(oldRefreshToken);
                DecodedJWT decodedJWT = jwtUtil.verifyToken(token);

                String redisKey = "refresh:"+token;
                String id = redisTemplate.opsForValue().get(redisKey);

                if (id == null) return Optional.empty();

                Long userId = Long.valueOf(id);
                Optional<User> userOptional = userService.findById(userId);
                if (userOptional.isEmpty()) return Optional.empty();

                User user = userOptional.get();

                redisTemplate.delete(redisKey);
                String newAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole().name(), user.getEmail());
                String newRefreshToken = jwtUtil.generateRefreshToken(user.getId());

                DecodedJWT newDecoded = jwtUtil.verifyToken(newRefreshToken);
                Long timeToLive = (newDecoded.getExpiresAt().getTime() - newDecoded.getIssuedAt().getTime()) /1000;
                String redisKeyNew = "refresh:"+newRefreshToken;
                redisTemplate.opsForValue().set(redisKeyNew, user.getId().toString(), Duration.ofSeconds(timeToLive));

                return Optional.of(new LoginResult(newAccessToken, newRefreshToken));
            }
            catch (Exception e) {
                return Optional.empty();
            }
        }

        public Boolean revokeRefreshToken(String maybePrefixedToken){
            String token = normalizeToken(maybePrefixedToken);
            String redisKey= "refresh:" + token;
            Boolean exist = redisTemplate.hasKey(redisKey);
            redisTemplate.delete(redisKey);
            return Boolean.TRUE.equals(exist);
        }

        public Boolean blackListAccessToken(String maybePrefixedToken){
            try{
                String token = normalizeToken(maybePrefixedToken);
                String redisKey = "blacklist:"+token;
                DecodedJWT decodedJWT = jwtUtil.verifyToken(token);
                Long timeToLive = (decodedJWT.getExpiresAt().getTime() - System.currentTimeMillis()) /1000;
                if (timeToLive <= 0) return false;
                redisTemplate.opsForValue().set(redisKey, "1", Duration.ofSeconds(timeToLive));
                return true;
            }
            catch (Exception e){
                return false;
            }
        }
        private String normalizeToken(String token){
            if (token==null) return "";
            String newToken = token.trim();
            if (newToken.startsWith("Bearer ")) newToken = newToken.substring("Bearer ".length()).trim();
            if (newToken.startsWith("refresh ")) newToken = newToken.substring("refresh ".length()).trim();
            return newToken;
        }

        public static class LoginResult{
            public final String accessToken;
            public final String refreshToken;
            public LoginResult(String accessToken, String refreshToken){
                this.accessToken=accessToken;
                this.refreshToken=refreshToken;
            }
        }

    }
