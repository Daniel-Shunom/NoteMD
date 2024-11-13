"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ssk1 from '@/public/ssk1.png';
import ssk2 from '@/public/ssk2.png';
import ssk3 from '@/public/ssk3.png';
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import Link from "next/link";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Easy to use",
      description:
        "Track and manage patient status with ease using our intuitive interface.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Track prescriptions",
      description:
        "Manage patient prescriptions with ease.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Intuitive interface",
      description:
        "Enjoy seamless interactions with your doctor, away or not",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-800",
    },
    {
      title: "Made for everyone",
      description:
        "Designed to be used for medical industries all over the world, NoteMD uses fast and scalable technology to boost productivity.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  return (
    <div className="relative z-20 py-8 lg:py-32 max-w-7xl mx-auto">
      <div className="px-4 sm:px-6">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black">
          Designed to streamline workflow
        </h4>

        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal text-black">
          Including integrated chatbot assistant, Retrieval Augmented Generation implementation, live prescription service, and appointment scheduling
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-10 xl:border rounded-md dark:border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-6 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-neutral-800 text-center font-normal dark:text-neutral-800",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex flex-col items-center py-4 px-2 gap-4 h-full">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-4 bg-white dark:bg-transparent shadow-2xl rounded-lg">
        <Image
          src={ssk1} // Your custom image
          alt="Track Issues"
          layout="responsive"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover rounded-sm"
        />
      </div>
      {/* Gradient overlays */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-transparent via-white dark:via-transparent to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white dark:from-transparent via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonTwo = () => {
  return (
    <div className="relative flex flex-col items-center py-4 px-2 gap-4 h-full">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-4 bg-white dark:bg-transparent shadow-2xl rounded-lg">
        <Image
          src={ssk2} // Your single custom image
          alt="Capture with AI"
          layout="responsive"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover rounded-lg"
        />
      </div>
      {/* Optional: Add gradient overlays if needed */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-transparent to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-transparent to-transparent h-full pointer-events-none" />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <Link
      href="https://youtu.be/Gzz7VCvZRtc"
      target="_blank"
      className="relative flex flex-col items-center h-full group/image"
    >
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-4 bg-transparent dark:bg-transparent shadow-none group h-full">
        <div className="relative">
          <IconBrandYoutubeFilled className="h-12 w-12 md:h-16 md:w-16 absolute z-10 inset-0 text-red-500 m-auto" />
          <Image
            src={ssk3}
            alt="YouTube Thumbnail"
            layout="responsive"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-sm transition duration-200 ease-in-out group-hover/image:blur-md"
          />
        </div>
      </div>
    </Link>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-80 flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-20 -bottom-40 md:-bottom-60" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1200, // 600 * 2
      height: 1200, // 600 * 2
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
