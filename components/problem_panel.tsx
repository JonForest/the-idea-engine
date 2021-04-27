import React from 'react'


const data = {
  problem: "Can't program fast enough to be valuable",
  notes: "Just not thinking in the right ways to be *quick*"
}

interface ProblemPanelInterface {
  onClick: () => void
}

export default function ProblemPanel ({onClick}) {
  return <div className="shadow-2xl w-60 h-60 overflow-hidden rounded-xl p-2 bg-white text-black" onClick={onClick}>
    <h3 className="font-bold">Problem</h3>
    <p>This is a problem logged today</p>
  </div>
}