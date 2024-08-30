import FileUpload from "./upload/page";
import React from 'react';
import MainLayout from './layouts/MainLayout';
import HeroSection from './components/HeroSection';

const HomePage: React.FC = () => {
  return (
    <FileUpload />
    // <MainLayout>
    //   <HeroSection />
    // </MainLayout>
  );
};

export default HomePage;
