package com.example.Back.Services;

import com.example.Back.Model.Entity.Users;
import com.example.Back.Repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    @Autowired
    UsersRepo usersRepo;
    public Users Verify(String username){
        return usersRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
