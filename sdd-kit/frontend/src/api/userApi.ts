// src/api/userApi.ts
import axios, { AxiosResponse } from 'axios';
import { User } from '../types/user';

const API_BASE_URL = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreateUserRequest {
  username: string;
  email: string;
}

export interface UpdateUserRequest {
  email: string;
}

export const userApi = {
  getUsers: (): Promise<User[]> => {
    return apiClient.get('/users').then((response: AxiosResponse) => response.data);
  },

  getUserById: (id: number): Promise<User> => {
    return apiClient.get(`/users/${id}`).then((response: AxiosResponse) => response.data);
  },

  createUser: (userData: CreateUserRequest): Promise<User> => {
    return apiClient.post('/users', userData).then((response: AxiosResponse) => response.data);
  },

  updateUser: (id: number, userData: UpdateUserRequest): Promise<User> => {
    return apiClient.put(`/users/${id}`, userData).then((response: AxiosResponse) => response.data);
  },

  deleteUser: (id: number): Promise<void> => {
    return apiClient.delete(`/users/${id}`).then(() => undefined);
  },
};