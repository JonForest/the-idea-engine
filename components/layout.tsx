import React, { PropsWithChildren, ReactChildren } from 'react';
import { firebaseAuth } from '../utils/data_connectivity';
import useUser from '../utils/hooks';
import Banner from './banner';

interface BannerInterface {
  forceChildren?: boolean
}

export default function Layout({ children, forceChildren = false }: PropsWithChildren<BannerInterface>) {
  const user = firebaseAuth.currentUser
  return (
    <div>
      <Banner showMenu={!!user} />
      {(!!user || forceChildren) && <div className="pt-28">{children}</div>}
    </div>
  );
}
