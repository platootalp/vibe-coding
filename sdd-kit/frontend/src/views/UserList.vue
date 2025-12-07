<template>
  <div class="user-list">
    <h1>用户管理</h1>
    <div class="actions">
      <button @click="handleCreate">创建用户</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>邮箱</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.createdAt }}</td>
          <td>
            <button @click="handleEdit(user)">编辑</button>
            <button @click="handleDelete(user)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'UserList',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const users = ref([]);

    onMounted(async () => {
      await userStore.fetchUsers();
      // 模拟数据
      users.value = [
        { id: 1, username: 'john_doe', email: 'john@example.com', createdAt: '2023-01-01' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', createdAt: '2023-01-02' }
      ];
    });

    const handleCreate = () => {
      router.push('/users/create');
    };

    const handleEdit = (user) => {
      router.push(`/users/${user.id}/edit`);
    };

    const handleDelete = async (user) => {
      if (confirm(`确定要删除用户 ${user.username} 吗？`)) {
        await userStore.deleteUser(user.id);
        // 重新加载用户列表
        await userStore.fetchUsers();
      }
    };

    return {
      users,
      handleCreate,
      handleEdit,
      handleDelete
    };
  }
};
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.actions {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>