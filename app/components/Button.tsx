// app/components/Button.tsx

import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
