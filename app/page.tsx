import React from 'react';
import MainLayout from './layouts/MainLayout';
import HeroSection from './components/HeroSection';
import {Header} from '@/components/ui/Header'
import { Hero } from "@/components/ui/Hero";
import { Features } from "@/components/ui/Features";
import { FAQs } from "@/components/ui/FAQs";
import { CallToAction } from "@/components/ui/CallToAction";
import { Footer } from "@/components/ui/Footer";
import { DashPreview } from '@/components/ui/Dashpreview';


export default function Home() {
  return (
    <>
    <Header/>
    <Hero />
    <Features />
    <DashPreview />
    <FAQs />
    <CallToAction />
    <Footer />
    </>
  );
};

