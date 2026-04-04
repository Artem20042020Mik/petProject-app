package org.example.auth_clean.service;

import org.example.auth_clean.model.Role;
import org.example.auth_clean.model.User;
import org.example.auth_clean.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
    }

    public User register(String email, String rawPassword){
        String hashed = passwordEncoder.encode(rawPassword);
        User user = new User(email, hashed, Role.ROLE_USER);
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long Id){
        return userRepository.findById(Id);
    }
}
