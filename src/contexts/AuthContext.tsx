
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// This is a placeholder for AWS Amplify Auth
// In a real implementation, you'd use Amplify Auth methods

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real implementation, this would use Amplify Auth
        // const user = await Auth.currentAuthenticatedUser();
        
        // Mock implementation for now
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        // User is not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would use Amplify Auth
      // const user = await Auth.signIn(email, password);
      
      // Mock implementation
      const user = { id: '1', username: email.split('@')[0], email };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', 'mock-jwt-token');
      
      setUser(user);
      toast.success("Welcome back!");
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would use Amplify Auth
      // await Auth.signUp({ username: email, password, attributes: { email, name: username } });
      
      // Mock implementation
      toast.success("Account created! Please check your email for verification.");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // In a real implementation, this would use Amplify Auth
      // await Auth.signOut();
      
      // Mock implementation
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      
      setUser(null);
      toast.success("You've been logged out");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
