package com.example.Back.Model.Dto;

import com.example.Back.Model.Entity.Users;

public class Auth {
    private String username;
    private String password;
    private Long id;
    private Users.Role role;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Users.Role getRole() {
        return role;
    }

    public void setRole(Users.Role role) {
        this.role = role;
    }
}