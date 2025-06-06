package com.example.Back.Model.Dto;

public class LoginResponse {
    private boolean success;
    private String role; // "admin" or "user" or "none"
    private String message;

    public LoginResponse(boolean success, String role, String message) {
        this.success = success;
        this.role = role;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
