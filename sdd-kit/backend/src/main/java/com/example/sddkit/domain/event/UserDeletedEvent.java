package backend.domain.event;

/**
 * 用户删除事件
 */
public class UserDeletedEvent {
    private final Long userId;
    private final String username;

    public UserDeletedEvent(Long userId, String username) {
        this.userId = userId;
        this.username = username;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public String toString() {
        return "UserDeletedEvent{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                '}';
    }
}