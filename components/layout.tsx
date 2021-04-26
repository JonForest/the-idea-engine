import React, { PropsWithChildren, ReactChildren } from 'react';

export default function Layout({ children }: PropsWithChildren<{}>) {
  return <div className='min-h-screen bg-gray-100'>{children}</div>;
}
