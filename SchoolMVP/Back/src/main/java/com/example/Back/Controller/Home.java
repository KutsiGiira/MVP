package com.example.Back.Controller;

import com.example.Back.Model.Dto.LoginRequest;
import com.example.Back.Model.Dto.LoginResponse;
import com.example.Back.Model.Entity.Admin;
import com.example.Back.Model.Entity.Parent;
import com.example.Back.Repository.AdminRepo;
import com.example.Back.Repository.ParentRepo;
import com.example.Back.Services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class Home {
    private AdminRepo admin;
    private AuthService authService;
    private ParentRepo parent;

    public Home(AdminRepo admin, AuthService authService, ParentRepo parent) {
        this.admin = admin;
        this.authService = authService;
        this.parent = parent;
    }

    @GetMapping("/admins")
    public String home(){
        return "Admin Page";
    }
    @GetMapping("/parents")
    public String Parent(){
        return "Parent Page";
    }
        @PostMapping("/login")
        public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
            LoginResponse response = authService.login(request.getUsername(), request.getPassword());
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        }
    }