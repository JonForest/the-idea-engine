import React, { PropsWithChildren } from 'react'

export default function BufferedContent({children}: PropsWithChildren<{}>) {
  return (
      <div className="flex flex-row">
        <div className="w-8 flex-none">{/* Left column */}</div>
        <div className="flex-grow">
          <div className="flex flex-column w-full">
            {children}
          </div>
        </div>
        <div className="w-8 flex-none">{/* Right column */}</div>
      </div>
  )
}