package com.example.sddkit;

import com.example.sddkit.domain.model.User;
import com.example.sddkit.infrastructure.repository.JpaUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JpaUserRepository userRepository;

    @Test
    public void testCreateAndGetUser() throws Exception {
        // Create a user
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"email\":\"test@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        // Get the user
        mockMvc.perform(get("/api/v1/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    public void testGetAllUsers() throws Exception {
        // Add a couple of users
        User user1 = new User("user1", "user1@example.com");
        User user2 = new User("user2", "user2@example.com");
        userRepository.save(user1);
        userRepository.save(user2);

        // Get all users
        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$[0].username").exists())
                .andExpect(jsonPath("$[1].username").exists());
    }

    @Test
    public void testUpdateUser() throws Exception {
        // Create a user first
        User user = new User("olduser", "old@example.com");
        User savedUser = userRepository.save(user);

        // Update the user
        mockMvc.perform(put("/api/v1/users/" + savedUser.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"new@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("new@example.com"));
    }

    @Test
    public void testDeleteUser() throws Exception {
        // Create a user first
        User user = new User("todelete", "delete@example.com");
        User savedUser = userRepository.save(user);

        // Delete the user
        mockMvc.perform(delete("/api/v1/users/" + savedUser.getId()))
                .andExpect(status().isOk());

        // Verify user is "deleted" (soft delete)
        mockMvc.perform(get("/api/v1/users/" + savedUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deletedAt").isNotEmpty());
    }
}