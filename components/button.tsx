import React from 'react';

interface ButtonProps {
  children: string;
}

export default function Button({ children }: ButtonProps) {
  return (
    <button className='w-full border-black bg-green-700 text-white text-2xl p-4 rounded-xl shadow-2xl'>{children}</button>
  );
}
