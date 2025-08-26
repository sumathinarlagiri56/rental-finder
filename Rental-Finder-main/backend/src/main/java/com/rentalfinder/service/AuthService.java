package com.rentalfinder.service;

import com.rentalfinder.model.User;
import com.rentalfinder.payload.JwtRequest;
import com.rentalfinder.payload.JwtResponse;
import com.rentalfinder.payload.SignupRequest;
import com.rentalfinder.repository.UserRepository;
import com.rentalfinder.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    
    public JwtResponse authenticate(JwtRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(authentication);
        
        User user = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new JwtResponse(token, user.getId(), user.getUsername(), user.getEmail());
    }
    
    public JwtResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        
        User savedUser = userRepository.save(user);
        
        // Create authentication object for token generation
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            savedUser, null, savedUser.getAuthorities());
        String token = jwtTokenProvider.generateToken(authentication);
        
        return new JwtResponse(token, savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
    }
}
