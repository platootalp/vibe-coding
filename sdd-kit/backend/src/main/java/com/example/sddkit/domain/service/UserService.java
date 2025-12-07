package backend.domain.service;

import backend.domain.model.User;
import backend.domain.repository.UserRepository;
import backend.domain.event.UserCreatedEvent;
import backend.domain.event.UserUpdatedEvent;
import backend.domain.event.UserDeletedEvent;

import java.util.List;
import java.util.Optional;

/**
 * 用户领域服务
 */
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 创建用户
     */
    public User createUser(String username, String email) {
        // 检查用户名是否已存在
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("用户名已存在");
        }

        User user = new User(username, email);
        User savedUser = userRepository.save(user);
        
        // 发布用户创建事件
        UserCreatedEvent event = new UserCreatedEvent(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
        publishEvent(event);
        
        return savedUser;
    }

    /**
     * 更新用户
     */
    public User updateUser(Long userId, String email) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            throw new IllegalArgumentException("用户不存在");
        }

        User user = optionalUser.get();
        String oldEmail = user.getEmail();
        user.setEmail(email);
        
        User updatedUser = userRepository.save(user);
        
        // 发布用户更新事件
        UserUpdatedEvent event = new UserUpdatedEvent(updatedUser.getId(), oldEmail, email);
        publishEvent(event);
        
        return updatedUser;
    }

    /**
     * 删除用户
     */
    public void deleteUser(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            throw new IllegalArgumentException("用户不存在");
        }

        User user = optionalUser.get();
        user.setDeletedAt(java.time.LocalDateTime.now());
        userRepository.save(user);
        
        // 发布用户删除事件
        UserDeletedEvent event = new UserDeletedEvent(user.getId(), user.getUsername());
        publishEvent(event);
    }

    /**
     * 根据ID获取用户
     */
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    /**
     * 获取所有用户
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * 发布事件（简化实现，实际项目中会使用事件总线）
     */
    private void publishEvent(Object event) {
        // 在实际项目中，这里会将事件发布到事件总线
        System.out.println("发布事件: " + event.getClass().getSimpleName());
    }
}