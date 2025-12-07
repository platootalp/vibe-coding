<template>
  <div class="user-form">
    <h1>{{ isEditing ? '编辑用户' : '创建用户' }}</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input 
          id="username" 
          v-model="formData.username" 
          type="text" 
          required 
          :disabled="isEditing"
        />
      </div>
      
      <div class="form-group">
        <label for="email">邮箱:</label>
        <input 
          id="email" 
          v-model="formData.email" 
          type="email" 
          required 
        />
      </div>
      
      <div class="form-actions">
        <button type="submit">保存</button>
        <button type="button" @click="handleCancel">取消</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'UserForm',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    
    const isEditing = ref(false);
    const formData = ref({
      username: '',
      email: ''
    });

    onMounted(() => {
      if (props.id) {
        isEditing.value = true;
        // 模拟获取用户数据
        // const user = await userStore.getUserById(props.id);
        formData.value = {
          username: 'john_doe',
          email: 'john@example.com'
        };
      }
    });

    const handleSubmit = async () => {
      try {
        if (isEditing.value) {
          await userStore.updateUser(props.id, formData.value);
        } else {
          await userStore.createUser(formData.value);
        }
        router.push('/');
      } catch (error) {
        console.error('保存失败:', error);
      }
    };

    const handleCancel = () => {
      router.push('/');
    };

    return {
      isEditing,
      formData,
      handleSubmit,
      handleCancel
    };
  }
};
</script>

<style scoped>
.user-form {
  padding: 20px;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  margin-top: 20px;
}

button {
  margin-right: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
}

button[type="button"] {
  background-color: #6c757d;
  color: white;
}
</style>