import React, { useEffect, useState, useRef } from 'react';
import Router from 'next/router';
import firebase from 'firebase';
import { isEmptyObj } from './utils';
import { tryGetPreviewData } from 'next/dist/next-server/server/api-utils';

interface useUserInterface {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export default function useUser({ redirectTo = '/login', redirectIfFound = false }: useUserInterface = {}): {
  user: firebase.User | undefined;
} {
  const [user, setUser] = useState<firebase.User | {} | undefined>();
  firebase.auth().onAuthStateChanged((fbUser) => {
    if (!fbUser && user && isEmptyObj(user)) {
      // user not set, but state already set with empty object.
      // Do nothing, as setting state to an empty object just updates state for no reason
      // Causing a re-render
      return;
    }
    setUser(fbUser || {});
  });

  useEffect(() => {
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!user) return;

    if ((redirectIfFound && !user['isAnonymous']) || isEmptyObj(user) || user['isAnonymous']) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  // User is either undefined while loading, or a firebase.User if loaded
  return { user: !user || isEmptyObj(user) ? undefined : (user as firebase.User) };
}

export function usePrevious(value: any) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export function useLeft(size: number): number {
  const [left, setLeft] = useState<number>(0);
  useEffect(() => {
    const width = window.innerWidth;
    setLeft((width - size) / 2);
  }, [size]);

  return left;
}

/**
 * Allows many DOM nodes of the same type to use the same "ref", meaning we can perserve them across renders
 * and use for things like animations.
 */
 export function useRefArray() {
  const ref = useRef([])
  // Remove any nodes that we had captured, but have been removed from the Dom
  ref.current = ref.current.filter(item => !!document.getElementById(item.id))

  const returnFunc = (domNode: any) => {
    if (domNode && !domNode.id) throw new Error('DomNode must have "id" property to use "useRefArray"')
    if (domNode && !ref.current.some(item => item.id === domNode.id)) {
      ref.current.push(domNode)
    }
  }

  returnFunc.current = ref.current

  return returnFunc;
}