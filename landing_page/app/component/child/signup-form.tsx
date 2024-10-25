"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface SignupFormProps {
  userType: "doctor" | "patient";
}

export function SignupForm({ userType }: SignupFormProps) { // Renamed for clarity
  const [formData, setFormData] = useState<{
    name: string;
    lname: string;
    email: string;
    password: string;
    cpassword: string;
    licenseNumber?: string; // Optional field for doctors
  }>({
    name: '',
    lname: '',
    email: '',
    password: '',
    cpassword: '',
  });
  
  const [error, setError] = useState('');

  console.log("Form Data:", formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");

    const { name, lname, email, password, cpassword, licenseNumber } = formData;

    // Basic Validation
    if (!name || !lname || !email || !password || !cpassword || (userType === "doctor" && !licenseNumber)) {
      setError('All fields are required');
      return;
    }
    if (password !== cpassword) {
      setError('Passwords must match!');
      return;
    }

    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/register', { // Update to your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          lname,
          email,
          password,
          userType,
          ...(userType === "doctor" && { licenseNumber }) // Include licenseNumber if doctor
        })
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        console.log('User registration failed:', data.message);
        setError(data.message || 'Registration failed');
      } else {
        console.log('User registered successfully:', data.message);
        // Reset form fields by resetting state variables
        setFormData({
          name: '',
          lname: '',
          email: '',
          password: '',
          cpassword: '',
          licenseNumber: '',
        });
        // Optionally, redirect the user
        // router.push('/login');
      }
    } catch (error) {
      console.log('Error:', error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black overflow-hidden">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 break-words">
        {userType === "doctor" ? "Doctor" : "Patient"} Signup
      </h2>
      <p className="text-neutral-600 text-sm max-w-full mt-2 dark:text-neutral-300 break-words">
        {userType === "doctor" ? "Register as a Doctor" : "Register as a Patient"}
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* Using Grid for Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              name="name" // Added name attribute
              placeholder="John"
              type="text"
              className="w-full"
              value={formData.name}
              onChange={handleChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              name="lname" // Added name attribute
              placeholder="Doe"
              type="text"
              className="w-full"
              value={formData.lname}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4 w-full">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            name="email" // Added name attribute
            placeholder="abc@xyz.com" 
            type="email" 
            className="w-full" 
            value={formData.email}
            onChange={handleChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4 w-full">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            name="password" // Added name attribute
            placeholder="••••••••" 
            type="password" 
            className="w-full" 
            value={formData.password}
            onChange={handleChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4 w-full">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            name="cpassword" // Added name attribute
            placeholder="••••••••"
            type="password"
            className="w-full"
            value={formData.cpassword}
            onChange={handleChange}
          />
        </LabelInputContainer>

        {/* Conditionally render License Number for doctors */}
        {userType === "doctor" && (
          <LabelInputContainer className="mb-8 w-full">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              placeholder="ABC12345"
              type="text"
              className="w-full"
              value={formData.licenseNumber || ''}
              onChange={handleChange}
            />
          </LabelInputContainer>
        )}

        <button
          className="bg-gradient-to-br relative group from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-inner transition-colors duration-300 hover:from-neutral-700 hover:to-neutral-500"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
        {error && (
          <div className="mt-4 text-red-500">
            {error}
          </div>
        )}

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-px w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

interface LabelInputContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LabelInputContainer: React.FC<LabelInputContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
