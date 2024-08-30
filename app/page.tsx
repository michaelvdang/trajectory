import FileUploaderBox from "@/components/FileUpload";
import Upload from "./upload/page";
import React from 'react';
import MainLayout from './layouts/MainLayout';
import HeroSection from './components/HeroSection';

const HomePage: React.FC = () => {
  return (
    <Upload />
    // <MainLayout>
    //   <HeroSection />
    // </MainLayout>
  );
};

export default HomePage;
