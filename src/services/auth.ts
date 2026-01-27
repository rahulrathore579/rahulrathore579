import api from './api';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '../types/user';

export const authService = {
    async signup(credentials: SignupCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/signup', credentials);
        return response.data;
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<{ user: User }>('/auth/me');
        return response.data.user;
    },

    async refreshToken(): Promise<string> {
        const response = await api.post<{ token: string }>('/auth/refresh');
        return response.data.token;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getStoredToken(): string | null {
        return localStorage.getItem('token');
    },

    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    storeAuth(token: string, user: User) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },
};
