// src/components/CustomButton.jsx
import React from 'react';

export function CustomButton({ onClick, children, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-indigo-500 p-3 rounded-lg hover:cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
