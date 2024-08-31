import FileUpload from "./upload/page";
import React from 'react';
import MainLayout from './layouts/MainLayout';
import HeroSection from './components/HeroSection';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FileUpload />
    </MainLayout>
  );
};

export default HomePage;
