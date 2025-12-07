package com.example.sddkit.interfaces.rest;

import com.example.sddkit.application.dto.CreateUserRequest;
import com.example.sddkit.application.dto.UserResponse;
import com.example.sddkit.domain.model.User;
import com.example.sddkit.domain.service.UserService;
import com.example.sddkit.domain.repository.UserRepository;
import com.example.sddkit.infrastructure.repository.JpaUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userService = new UserService(userRepository);
    }

    @PostMapping
    public UserResponse createUser(@RequestBody CreateUserRequest request) {
        User user = userService.createUser(request.getUsername(), request.getEmail());
        return toUserResponse(user);
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(this::toUserResponse)
                .orElse(null);
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id, @RequestBody CreateUserRequest request) {
        User user = userService.updateUser(id, request.getEmail());
        return toUserResponse(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    private UserResponse toUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setCreatedAt(user.getCreatedAt().toString());
        response.setUpdatedAt(user.getUpdatedAt().toString());
        return response;
    }
}