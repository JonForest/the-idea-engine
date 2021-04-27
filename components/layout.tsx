import React, { PropsWithChildren, ReactChildren } from 'react';
import Banner from './banner';

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Banner />
      <div className='pt-28'>
      {children}
      </div>
    </div>
  );
}
