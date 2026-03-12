import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, SignupCredentials } from '../types/user';
import { authService } from '../services/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (credentials: SignupCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('AuthProvider: Checking for stored auth...');
        const storedUser = authService.getStoredUser();
        const storedToken = authService.getStoredToken();

        if (storedUser && storedToken) {
            console.log('AuthProvider: Found stored user:', storedUser.email);
            setUser(storedUser);
        } else {
            console.log('AuthProvider: No stored auth found');
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        console.log('AuthProvider: Logging in...', credentials.email);
        const response = await authService.login(credentials);
        authService.storeAuth(response.token, response.user);
        setUser(response.user);
    };

    const signup = async (credentials: SignupCredentials) => {
        const response = await authService.signup(credentials);
        authService.storeAuth(response.token, response.user);
        setUser(response.user);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

