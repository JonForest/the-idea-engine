import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Problem } from '../utils/types';

const data = {
  problem: "Can't program fast enough to be valuable",
  notes: 'Just not thinking in the right ways to be *quick*',
};

interface ProblemPanelInterface {
  onClick: () => void;
  problem: Problem;
}

export default function ProblemPanel({ problem, onClick }) {
  return (
    <div
      className="flex flex-col justify-between shadow-xl w-72 h-72 overflow-hidden rounded-xl p-2 bg-white text-black"
      onClick={onClick}
    >
      <div className="overflow-y-auto h-60">
        <h3 className="font-bold">Problem</h3>
        <div>
          <ReactMarkdown>{problem.problem}</ReactMarkdown>
        </div>
        <h3 className="font-bold mt-4">Notes</h3>
        <div>
          <ReactMarkdown>{problem.notes}</ReactMarkdown>
        </div>
      </div>
      <div className="mt-4 justify-self-end">
        <button className="w-4/5 px-4 py-1 bg-red-200 rounded-md m-4 shadow-lg">Discard</button>
      </div>
    </div>
  );
}

export function ProblemPanelLoading() {
  return (
    <div className="flex flex-col justify-between shadow-xl w-72 h-72 overflow-hidden rounded-xl p-2 bg-gray-300 text-black animate-pulse mx-6"></div>
  );
}
