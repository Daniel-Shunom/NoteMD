// app/components/AuthContainer/components/LoginForm.tsx

import React, { useState, useEffect, useRef, useContext } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../context/Authcontext';

interface LoginFormProps {
  onToggle: () => void; // Function to toggle to Signup form
  userType?: 'doctor' | 'patient'; // Fixed user role (if provided)
}

export function LoginForm({ onToggle, userType: fixedUserType }: LoginFormProps) {
  const [userType, setUserType] = useState<'doctor' | 'patient'>(fixedUserType || 'patient');

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const firstInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const authContext = useContext(AuthContext); // Access AuthContext

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'doctor' | 'patient';
    setUserType(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');

    const { email, password } = formData;

    // Basic Validation
    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({
          email,
          password,
          userType,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        console.log('Login failed:', data.message);
        setError(data.message || 'Login failed');
      } else {
        console.log('Login successful:', data.message);
        setSuccess(data.message || 'Login successful');
        setFormData({
          email: '',
          password: '',
        });

        // Update AuthContext with user data
        if (authContext) {
          authContext.setAuth({ user: data.user, loading: false });
        }

        // Redirect the user based on role
        if (data.user.role === 'doctor') {
          router.push("/home"); // Redirect to home or appropriate page
        } else if (data.user.role === 'patient') {
          router.push("/home"); // Redirect to home or appropriate page
        } else {
          router.push(`/home`); // Default redirect within the same app
        }
      }
    } catch (error) {
      console.log('Error:', error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black overflow-hidden">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 break-words">
        Login
      </h2>
      <p className="text-neutral-600 text-sm max-w-full mt-2 dark:text-neutral-300 break-words">
        Please login to your account
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* Role Selection Dropdown */}
        {!fixedUserType && (
          <Select
            id="userType"
            label="Select Role"
            value={userType}
            onChange={handleRoleChange}
            className="mb-6"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </Select>
        )}

        {/* Email Field */}
        <LabelInputContainer className="mb-4 w-full">
          <Label htmlFor="email">Email Address</Label>
          <Input
            ref={firstInputRef}
            id="email"
            name="email"
            placeholder="abc@xyz.com"
            type="email"
            className="w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </LabelInputContainer>

        {/* Password Field */}
        <LabelInputContainer className="mb-6 w-full">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            className="w-full"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </LabelInputContainer>

        {/* Submit Button */}
        <button
          className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-inner transition-colors duration-300 hover:from-neutral-700 hover:to-neutral-500"
          type="submit"
        >
          Log in &rarr;
        </button>

        {/* Success Message */}
        {success && <div className="mt-4 text-green-500">{success}</div>}

        {/* Error Message */}
        {error && <div className="mt-4 text-red-500">{error}</div>}

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-px w-full" />
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {fixedUserType ? '' : "Don't have an account? "}{' '}
          <button onClick={onToggle} className="text-blue-500 hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

interface LabelInputContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LabelInputContainer: React.FC<LabelInputContainerProps> = ({ children, className }) => {
  return <div className={cn('flex flex-col space-y-2 w-full', className)}>{children}</div>;
};
