'use client'

import Link from 'next/link';
import Image from 'next/image';
import food from './images/food.png';

export default function HomePage() {
return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
    {/* In Next.js App Router, the <Head> component from 'next/head' is not used.
      Metadata should be handled by exporting a 'metadata' object in a server component (like a layout.tsx or page.tsx).
    */}

    <main className="text-center text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-up">
        Welcome to Food Tracker
        </h1>
        <p className="text-xl md:text-2xl font-light mb-8 animate-fade-in-up delay-200">
        Track your meal!!!
        </p>

        <div className="mb-12">
        <Image
            src={food}
            alt="Food Tracker graphic"
            width={400}
            height={300}
            className="rounded-xl shadow-lg animate-fade-in-up delay-400 mx-auto"
            priority
        />
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Link 
            href="/register"
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
        >
            Register
        </Link>
        <Link 
            href="/login"
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        >
            Login
        </Link>
        </div>
    </main>

    <style jsx>{`
        @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
        }
        .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out forwards;
        }
        .delay-200 {
        animation-delay: 0.2s;
        }
        .delay-400 {
        animation-delay: 0.4s;
        }
    `}</style>
    </div>
);
}
