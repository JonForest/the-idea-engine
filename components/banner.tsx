import React from 'react';
import Link from 'next/link';

export default function Banner() {
  return (
    <div className="fixed w-full top-0 px-8 text-gray-100 text-2xl lg:text-5xl font-bold pt-4 pb-4 bg-purple-800">
      the idea engine
      <nav className="text-lg">
        <Link href="/review_problems"><a>Review problems</a></Link>
      </nav>

    </div>
  );
}

// bg-gradient-to-r from-yellow-700 to-yellow-900">
