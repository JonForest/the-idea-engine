import React from 'react';

interface ButtonProps {
  children: string;
  width: 'full'|'half'|'auto';
}

export default function Button({ width='full', children }: ButtonProps) {
  const widthClass = {'full': 'w-full', 'half': 'w-1/2', 'auto':'w-auto'}[width]
  return (
    <button className={`${widthClass} border-black bg-green-700 text-white text-2xl p-4 rounded-xl shadow-2xl`}>
      {children}
    </button>
  );
}
