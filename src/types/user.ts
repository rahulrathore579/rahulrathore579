export interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
    updated_at: string;
    preferences: {
        theme: string;
        language: string;
        voice_enabled: boolean;
    };
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials extends LoginCredentials {
    name: string;
}
