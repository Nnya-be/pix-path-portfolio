
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuthForm() {
  const navigate = useNavigate();
  const { login, signup, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!loginData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(loginData.email)) newErrors.email = 'Invalid email format';
    
    if (!loginData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        await login(loginData.email, loginData.password);
        navigate('/dashboard');
      } catch (error) {
        // Error is handled in AuthContext
      }
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!signupData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(signupData.email)) newErrors.email = 'Invalid email format';
    
    if (!signupData.username) newErrors.username = 'Username is required';
    
    if (!signupData.password) newErrors.password = 'Password is required';
    else if (signupData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        await signup(signupData.email, signupData.password, signupData.username);
        setActiveTab('login');
      } catch (error) {
        // Error is handled in AuthContext
      }
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader>
          <CardTitle className="text-2xl text-center">PixPath</CardTitle>
          <CardDescription className="text-center">Your personal photo journey</CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent>
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit}>
              <div className="space-y-4">
                <div>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignupSubmit}>
              <div className="space-y-4">
                <div>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Username"
                    value={signupData.username}
                    onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>
                
                <div>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                
                <div>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="text-center text-sm text-gray-500">
          {activeTab === 'login' ? (
            <p>Don't have an account? <button className="text-primary hover:underline" onClick={() => setActiveTab('signup')}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button className="text-primary hover:underline" onClick={() => setActiveTab('login')}>Login</button></p>
          )}
        </CardFooter>
      </Tabs>
    </Card>
  );
}
