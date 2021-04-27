import React, { PropsWithChildren, ReactChildren } from 'react';
import Banner from './banner';

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Banner />

      <div className='flex flex-row pt-28'>
        <div className='w-8 flex-none'>{/* Left column */}</div>
        <div className='flex-grow'>{children}</div>
        <div className='w-8 flex-none'>{/* Right column */}</div>
      </div>
    </div>
  );
}
