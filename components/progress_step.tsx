import Link from 'next/link';
import React, { PropsWithChildren, SyntheticEvent } from 'react';

interface ProgressStepInterface {
  title: string;
  clickAction?: (e: SyntheticEvent) => void;
  isLoading?: boolean;
  isCurrent?: boolean;
  isCompleted?: boolean;
  isNavigable?: boolean;
  isLocked?: boolean;
}

export default function ProgressStep({
  title,
  clickAction = () => {},
  isLoading = false,
  isCurrent = false,
  isCompleted = false,
  isNavigable = true,
  isLocked = false,
  children,
}: PropsWithChildren<ProgressStepInterface>) {
  let progressClasses;
  if (isCurrent) {
    progressClasses = ' bg-purple-700 ';
  } else if (isNavigable) {
    progressClasses = ' bg-purple-100 ';
  } else if (!isNavigable) {
    progressClasses = ' bg-grey-300 ';
  }
  return (
    <li className="ml-0 pb-4 relative progressStep">
      <span
        className={`rounded-full border-2 border-purple-300 mr-3 ${progressClasses} progressStepMarker`}
        style={{ padding: '1px 8px' }}
      >
        &nbsp;
      </span>
      <button className="inline-block leading-4 mb-2 font-semibold text-lg focus:outline-none" onClick={clickAction}>
        {title}
      </button>
      <div className="ml-9">
        {isLoading ? <div className="w-full h-14 animate animate-pulse bg-gray-300" /> : children}
      </div>
    </li>
  );
}
