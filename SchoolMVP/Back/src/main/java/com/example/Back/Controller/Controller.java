package com.example.Back.Controller;

import com.example.Back.Component.JwtUtil;
import com.example.Back.Model.Dto.Auth;
import com.example.Back.Model.Dto.Log;
import com.example.Back.Model.Entity.Users;
import com.example.Back.Repository.UsersRepo;
import com.example.Back.Services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
    @Autowired
    LoginService loginService;
    @Autowired
    JwtUtil jwtutil;
    @Autowired
     AuthenticationManager authenticationManager;
    private UsersRepo usersRepo;
    private BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

    public Controller(UsersRepo usersRepo, BCryptPasswordEncoder encoder) {
        this.usersRepo = usersRepo;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admins")
    public String adminEndpoint() {
        return "Welcome Admin!";
    }
    @PreAuthorize("hasRole('TEACHER')")
    @GetMapping("/teachers")
    public String teacherEndpoint() {
        return "Welcome Teacher!";
    }
    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/parents")
    public String parentEndpoint() {
        return "Welcome Parent!";
    }
    @PostMapping("/new-user")
    public ResponseEntity<String> Register(@RequestBody Auth auth){
        try{
            Users user = new Users();
            user.setUsername(auth.getUsername());
            user.setPassword(encoder.encode(auth.getPassword()));
            user.setRole(auth.getRole());
            usersRepo.save(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("mat9ydch chi 7aja khasra f registry");
        }
        return ResponseEntity.ok("Registred Successfully");
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Log log) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(log.getUsername(), log.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String token = jwtutil.generateToken(userDetails);

            return ResponseEntity.ok(token);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong creds");
        }
    }
}