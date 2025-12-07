package backend.domain.event;

/**
 * 用户更新事件
 */
public class UserUpdatedEvent {
    private final Long userId;
    private final String oldValue;
    private final String newValue;

    public UserUpdatedEvent(Long userId, String oldValue, String newValue) {
        this.userId = userId;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    public Long getUserId() {
        return userId;
    }

    public String getOldValue() {
        return oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    @Override
    public String toString() {
        return "UserUpdatedEvent{" +
                "userId=" + userId +
                ", oldValue='" + oldValue + '\'' +
                ", newValue='" + newValue + '\'' +
                '}';
    }
}