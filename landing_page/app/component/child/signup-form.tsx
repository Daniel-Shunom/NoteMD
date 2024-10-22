"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export function SignupFormDemo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black overflow-hidden">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 break-words">
        Welcome to DoctorMD
      </h2>
      <p className="text-neutral-600 text-sm max-w-full mt-2 dark:text-neutral-300 break-words">
        Login
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* Using Grid for Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              placeholder="John"
              type="text"
              className="w-full"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              placeholder="Doe"
              type="text"
              className="w-full"
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4 w-full">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="abc@xyz.com" type="email" className="w-full" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4 w-full">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" className="w-full" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8 w-full">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            placeholder="••••••••"
            type="password"
            className="w-full"
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-inner transition-colors duration-300 hover:from-neutral-700 hover:to-neutral-500"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

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

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
