import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Problem } from '../utils/types'


const data = {
  problem: "Can't program fast enough to be valuable",
  notes: "Just not thinking in the right ways to be *quick*"
}

interface ProblemPanelInterface {
  onClick: () => void,
  problem: Problem
}

export default function ProblemPanel ({problem, onClick}) {
  return <div className="shadow-2xl w-60 h-60 overflow-hidden rounded-xl p-2 bg-white text-black" onClick={onClick}>
    <h3 className="font-bold">Problem</h3>
    <p><ReactMarkdown>{problem.problem}</ReactMarkdown></p>
    <h3 className="font-bold mt-4">Notes</h3>
    <p><ReactMarkdown>{problem.notes}</ReactMarkdown></p>
  </div>
}