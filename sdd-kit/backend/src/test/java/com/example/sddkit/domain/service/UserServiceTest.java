package com.example.sddkit.domain.service;

import com.example.sddkit.domain.model.User;
import com.example.sddkit.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository);
    }

    @Test
    void createUser_shouldCreateUser_whenValidDataProvided() {
        // Given
        String username = "testuser";
        String email = "test@example.com";
        User savedUser = new User(username, email);
        savedUser.setId(1L);

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        User result = userService.createUser(username, email);

        // Then
        assertNotNull(result);
        assertEquals(username, result.getUsername());
        assertEquals(email, result.getEmail());
        verify(userRepository).findByUsername(username);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_shouldThrowException_whenUsernameAlreadyExists() {
        // Given
        String username = "testuser";
        String email = "test@example.com";
        User existingUser = new User(username, email);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(existingUser));

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.createUser(username, email)
        );

        assertEquals("用户名已存在", exception.getMessage());
        verify(userRepository).findByUsername(username);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUser_shouldUpdateUserEmail_whenUserExists() {
        // Given
        Long userId = 1L;
        String newEmail = "newemail@example.com";
        User existingUser = new User("testuser", "old@example.com");
        existingUser.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // When
        User result = userService.updateUser(userId, newEmail);

        // Then
        assertNotNull(result);
        assertEquals(newEmail, result.getEmail());
        verify(userRepository).findById(userId);
        verify(userRepository).save(existingUser);
    }

    @Test
    void updateUser_shouldThrowException_whenUserNotFound() {
        // Given
        Long userId = 1L;
        String newEmail = "newemail@example.com";

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.updateUser(userId, newEmail)
        );

        assertEquals("用户不存在", exception.getMessage());
        verify(userRepository).findById(userId);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_shouldMarkUserAsDeleted_whenUserExists() {
        // Given
        Long userId = 1L;
        User existingUser = new User("testuser", "test@example.com");
        existingUser.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // When
        userService.deleteUser(userId);

        // Then
        verify(userRepository).findById(userId);
        verify(userRepository).save(existingUser);
        assertNotNull(existingUser.getDeletedAt());
    }

    @Test
    void deleteUser_shouldThrowException_whenUserNotFound() {
        // Given
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.deleteUser(userId)
        );

        assertEquals("用户不存在", exception.getMessage());
        verify(userRepository).findById(userId);
        verify(userRepository, never()).save(any(User.class));
    }
}