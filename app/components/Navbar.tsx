// app/components/Navbar.tsx

import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-2xl font-bold">Trajectory</a>
        </Link>
        <ul className="flex space-x-4">
          <li><Link href="#features"><a className="hover:text-blue-500">Features</a></Link></li>
          <li><Link href="#waitlist"><a className="hover:text-blue-500">Join Waitlist</a></Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
