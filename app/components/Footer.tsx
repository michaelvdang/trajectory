import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Trajectory. All rights reserved.</p>
        <div className="mt-4">
          <a href="#" className="hover:text-blue-400 mx-2">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 mx-2">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 mx-2">know the Team</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
