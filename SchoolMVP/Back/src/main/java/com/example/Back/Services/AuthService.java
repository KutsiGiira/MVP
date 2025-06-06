package com.example.Back.Services;

import com.example.Back.Model.Dto.LoginResponse;
import com.example.Back.Model.Entity.Admin;
import com.example.Back.Model.Entity.Parent;
import com.example.Back.Repository.AdminRepo;
import com.example.Back.Repository.ParentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private AdminRepo adminRepository;

    @Autowired
    private ParentRepo parentRepo;

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    public LoginResponse login(String username, String rawPassword) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
//            if (passwordEncoder.matches(rawPassword, admin.getPassword())) {
//                return new LoginResponse(true, "admin", "Login successful as admin");
//            }
        return new LoginResponse(true, "admin", "Login successful as admin");

        }

        Optional<Parent> userOpt = parentRepo.findByUsername(username);
        if (userOpt.isPresent()) {
            Parent user = userOpt.get();
//            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
//                return new LoginResponse(true, "user", "Login successful as user");
//            }
        return new LoginResponse(true, "user", "Login successful as user");

        }
        // if no match
        return new LoginResponse(false, "none", "Invalid username or password");
    }
}
