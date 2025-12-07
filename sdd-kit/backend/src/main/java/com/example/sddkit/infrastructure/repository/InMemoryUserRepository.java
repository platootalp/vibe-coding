package backend.infrastructure.repository;

import backend.domain.model.User;
import backend.domain.repository.UserRepository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 内存用户仓储实现
 */
public class InMemoryUserRepository implements UserRepository {
    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @Override
    public User save(User user) {
        if (user.getId() == null) {
            user.setId(idGenerator.getAndIncrement());
        }
        users.put(user.getId(), user);
        return user;
    }

    @Override
    public Optional<User> findById(Long id) {
        User user = users.get(id);
        return user != null && !user.isDeleted() ? Optional.of(user) : Optional.empty();
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return users.values().stream()
                .filter(user -> username.equals(user.getUsername()) && !user.isDeleted())
                .findFirst();
    }

    @Override
    public List<User> findAll() {
        return users.values().stream()
                .filter(user -> !user.isDeleted())
                .collect(ArrayList::new, (list, item) -> list.add(item), (list1, list2) -> list1.addAll(list2));
    }

    @Override
    public void deleteById(Long id) {
        User user = users.get(id);
        if (user != null) {
            user.setDeletedAt(java.time.LocalDateTime.now());
        }
    }
}