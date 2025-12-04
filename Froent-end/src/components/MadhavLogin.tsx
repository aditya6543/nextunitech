import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../services/api.js';

// Define a type for the form data
type LoginFormData = {
  email: string;
  password: string;
};

type SignupFormData = {
  name: string;
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const MadhavLogin: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const checkAuthentication = async () => {
      const storedToken = localStorage.getItem('madhav_token');
      if (storedToken) {
        try {
          const tokenData = JSON.parse(storedToken);
          
          // Simulate token validation (in a real app, you'd verify with backend)
          if (tokenData.service === 'madhav' && tokenData.token) {
            // For development, just check if token exists
            navigate('/madhav-ai');
            return;
          }
        } catch (err) {
          // Clear invalid token
          localStorage.removeItem('madhav_token');
        }
      }
    };

    checkAuthentication();
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(mode === 'login' ? loginSchema : signupSchema)
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await authService.login((data as LoginFormData).email, (data as LoginFormData).password);
      } else {
        await authService.signup({
          name: (data as SignupFormData).name,
          email: (data as SignupFormData).email,
          password: (data as SignupFormData).password
        });
        // After successful signup, log the user in automatically
        await authService.login((data as SignupFormData).email, (data as SignupFormData).password);
      }

      navigate('/madhav-ai');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
      console.error('Madhav auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`text-3xl font-extrabold ${mode === 'login' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
            >
              Madhav.ai Login
            </button>
          </div>
          <div className="mt-2 flex justify-center space-x-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-3 py-1 rounded ${mode === 'login' ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`px-3 py-1 rounded ${mode === 'signup' ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Signup
            </button>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            {mode === 'signup' && (
              <div>
                <label htmlFor="madhav-name" className="sr-only">Name</label>
                <input
                  {...register('name' as any)}
                  id="madhav-name"
                  type="text"
                  autoComplete="name"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Full name"
                />
                {'name' in errors && (errors as any).name && <p className="text-red-500 text-xs">{(errors as any).name.message}</p>}
              </div>
            )}
            <div>
              <label htmlFor="madhav-email" className="sr-only">Email address</label>
              <input
                {...register('email')}
                id="madhav-email"
                type="email"
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="madhav-password" className="sr-only">Password</label>
              <input
                {...register('password')}
                id="madhav-password"
                type="password"
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? (mode === 'login' ? 'Logging in...' : 'Creating account...') : (mode === 'login' ? 'Sign in' : 'Sign up')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MadhavLogin;
