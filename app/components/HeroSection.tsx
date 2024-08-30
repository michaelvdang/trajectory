import React from 'react';
import Button from './Button';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-blue-600 text-white py-20 text-center">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-4">Find Your Perfect Job</h2>
        <p className="text-lg mb-8">Let our AI match your skills with the best job opportunities.</p>
        <Button text="Join Waitlist" className="bg-white text-blue-600" />
      </div>
    </section>
  );
};

export default HeroSection;
