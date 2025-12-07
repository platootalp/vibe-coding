import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null
  }),

  actions: {
    async fetchUsers() {
      // 模拟API调用
      try {
        // 这里应该是实际的API调用
        // const response = await axios.get('/api/users');
        // this.users = response.data;
        console.log('Fetching users...');
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    async createUser(userData) {
      try {
        // 这里应该是实际的API调用
        // const response = await axios.post('/api/users', userData);
        // this.users.push(response.data);
        console.log('Creating user:', userData);
        return Promise.resolve({ id: Date.now(), ...userData });
      } catch (error) {
        console.error('Error creating user:', error);
        return Promise.reject(error);
      }
    },

    async updateUser(userId, userData) {
      try {
        // 这里应该是实际的API调用
        // const response = await axios.put(`/api/users/${userId}`, userData);
        // const index = this.users.findIndex(user => user.id === userId);
        // if (index !== -1) {
        //   this.users[index] = response.data;
        // }
        console.log('Updating user:', userId, userData);
        return Promise.resolve({ id: userId, ...userData });
      } catch (error) {
        console.error('Error updating user:', error);
        return Promise.reject(error);
      }
    },

    async deleteUser(userId) {
      try {
        // 这里应该是实际的API调用
        // await axios.delete(`/api/users/${userId}`);
        // this.users = this.users.filter(user => user.id !== userId);
        console.log('Deleting user:', userId);
        return Promise.resolve();
      } catch (error) {
        console.error('Error deleting user:', error);
        return Promise.reject(error);
      }
    }
  }
});