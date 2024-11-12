"use client"
import Image from "next/image";
import Navbar from "@/app/component/ui/Navbar";
import image from '@/public/dr-cloud.png';
import { FeaturesSectionDemo } from "@/app/component/child/FeatureSection";
import WaitlistForm from "@/app/component/child/waitlistform";
import CredentialsBox from "@/app/component/child/Credentialsbox";

export default function Home() {
  const doctorLogin = process.env.NEXT_PUBLIC_DOCTOR_LOGIN;
  const patientLogin = process.env.NEXT_PUBLIC_PATIENT_LOGIN;

  // Function to handle navigation
  const handleNavigation = (url: string | undefined) => {
    if (url) {
      window.location.href = url;
    }
  };

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
      <section className="py-20 bg-white text-black">
        <div className="container mx-auto max-w-[90%] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Enhancing Healthcare, {' '}
                <br className="hidden lg:block" /> One Patient at a Time
              </h1>
              <p className="text-lg sm:text-xl mb-8">
                Empowering healthcare providers with AI-driven solutions 
                <br className="hidden lg:block" />for exceptional patient experience
              </p>
              
              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleNavigation(doctorLogin)}
                  className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-100 hover:text-black transition duration-300"
                >
                  Doctor login
                </button>
                <button
                  onClick={() => handleNavigation(patientLogin)}
                  className="bg-transparent border border-gray-800 text-black px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-800 transition duration-300"
                >
                  Patient login
                </button>
              </div>
              <div className="left-0">
                <CredentialsBox/>
              </div>
            </div>
            
            {/* Illustration/Image */}
            <div className="w-full lg:w-1/2 flex justify-center pt-[10vh]">
              <Image 
                src={image} 
                alt="Patient Management Illustration" 
                width={500} 
                height={500} 
                className="rounded-lg shadow-lg w-full max-w-sm" 
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-black">
        <div className="container mx-auto max-w-[90%] px-4 sm:px-6 lg:px-8">
          <FeaturesSectionDemo />
        </div>
        <WaitlistForm/>
      </section>
      
      <footer className="w-full bg-gray-900 text-center py-4">
        <p className="text-gray-400">NoteMD 2024 All Rights Reserved</p>
      </footer>
    </main>
  );
}