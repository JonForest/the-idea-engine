import { useEffect, useState } from 'react';
import Router from 'next/router';
import firebase from 'firebase';
import { isEmptyObj } from './utils';

interface useUserInterface {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export default function useUser({ redirectTo = '/login', redirectIfFound = false }: useUserInterface = {}): {user: firebase.User | undefined} {
  const [user, setUser] = useState<firebase.User | {} | undefined>();
  firebase.auth().onAuthStateChanged((fbUser) => {
    if (!fbUser && user && isEmptyObj(user)) {
      // user not set, but state already set with empty object.
      // Do nothing, as setting state to an empty object just updates state for no reason
      // Causing a re-render
      return
    }
    setUser(fbUser || {});
  });

  useEffect(() => {
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!user) return

    if ((redirectIfFound && !user['isAnonymous']) || isEmptyObj(user) || user['isAnonymous']) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  // User is either undefined while loading, or a firebase.User if loaded
  return {user: !user || isEmptyObj(user) ? undefined : user as firebase.User};
}
