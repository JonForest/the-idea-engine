import { useEffect, useState, useRef } from 'react';
import Router from 'next/router';
import firebase from 'firebase';
import { isEmptyObj } from './utils';
import { panelWidth, panelHeight } from '../components/problem_panels/problem_panel';

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

export function useLeft(size: number, maxVal: number = 0): number {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 414; // iphone 6/7/8 width
  const [left, setLeft] = useState<number>(0);
  useEffect(() => {
    const width = windowWidth
    const proposedLeft = (width - size) / 2;
    setLeft(maxVal && proposedLeft > maxVal ? maxVal : proposedLeft);
  }, [size, windowWidth]);

  return left;
}

/**
 * Allows many DOM nodes of the same type to use the same "ref", meaning we can perserve them across renders
 * and use for things like animations.
 */
export function useRefArray() {
  const ref = useRef([]);
  // Remove any nodes that we had captured, but have been removed from the Dom
  ref.current = ref.current.filter((item) => !!document.getElementById(item.id));

  const returnFunc = (domNode: any) => {
    if (domNode && !domNode.id) throw new Error('DomNode must have "id" property to use "useRefArray"');
    if (domNode && !ref.current.some((item) => item.id === domNode.id)) {
      ref.current.push(domNode);
    }
  };

  returnFunc.current = ref.current;

  return returnFunc;
}

export function useIsScrollable() {
  const [isScrollable, setIsScrollable] = useState<boolean>(true);
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 414; // iphone 6/7/8 width
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 414;

  useEffect(() => {
    // if the windowWidth and windowHeight is greater than 3 panels (albeit with no margin), then we won't have scrolling
    setIsScrollable(!(window && windowWidth > panelWidth * 3 && windowHeight > panelHeight + 100));
  }, [windowWidth]);

  return isScrollable
}