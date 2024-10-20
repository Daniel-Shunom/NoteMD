"use client"
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import client from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Navbar from "@/app/component/ui/Navbar";
import image from '@/public/dr-cloud.png';

export default function Home() {
  return (
    <main>
  <Navbar
    logo={
      <Image
        src={image}
        alt="Logo"
        width={30}
        height={10}
        priority // Ensures the logo loads quickly
        className="logo-image"
      />
    }
    links={[
      { name: 'Try Demo', href: '/try-demo' },
      { name: 'Contact', href: '/contact' },
    ]}
  />

  {/* Hero Section */}
  <section className="py-20 bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
    <div className="mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center max-w-[90%]">
      
      {/* Text Content */}
      <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          The Best Patient Management System{' '}
          <br className="hidden lg:block" /> to Exist
        </h1>
        <p className="text-lg sm:text-xl mb-8">
          Streamline your healthcare operations with our intuitive and comprehensive patient management solution.
        </p>
        
        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/get-started"
            className="bg-white text-blue-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </a>
          <a
            href="/learn-more"
            className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-800 transition duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
      
      {/* Illustration/Image */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <Image 
          src={image} 
          alt="Patient Management Illustration" 
          width={400} 
          height={400} 
          className="rounded-lg shadow-lg w-full max-w-sm" 
          priority
        />
      </div>
    </div>
  </section>
</main>

  );
}
