import React, { PropsWithChildren, ReactChildren } from 'react';
import Banner from './banner';

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div>
      <Banner />
      <div className='pt-28'>
      {children}
      </div>
    </div>
  );
}
