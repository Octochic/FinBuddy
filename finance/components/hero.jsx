"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
    const imageRef = useRef();

    useEffect(() => {
        const imageElement = imageRef.current;
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
            } else {
                imageElement.classList.remove("scrolled");
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="pb-20 px-4">
            <div className="container mx-auto text-center">
                <h1 className="text-2xl md:text-5xl lg:text-7xl pb-6 gradient-title">
                    Manage Your Finances with Intelligence
                </h1>
                <p>
                    An AI-powered personal finance app that helps you track your expenses, set budgets, and achieve your financial goals and optimize your spending with real-time insights.
                </p>
                <div>
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8">Get Started</Button>
                    </Link>
                    <Link href="https://www.google.com">
                        <Button size="lg" variant='outline' className="px-8">Watch Demo</Button>
                    </Link>
                </div>

                <div className="hero-image-wrapper">
                    <div ref={imageRef} className="hero-image">
                        <Image src="/Hero.jpg" alt="Preview"
                            width={1280}
                            height={300}
                            className="rounded-lg shadow-2xl border mx-auto" priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;