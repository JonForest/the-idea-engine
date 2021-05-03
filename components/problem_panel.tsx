import React from 'react';
import ReactMarkdown from 'react-markdown';
import { deleteProblem } from '../utils/data_connectivity';
import { Problem } from '../utils/types';

interface ProblemPanelInterface {
  onClick: () => void;
  problem: Problem;
  onDelete?: () => void;
}

export default function ProblemPanel({ problem, onClick, onDelete }: ProblemPanelInterface) {
  async function deleteAction(e: React.SyntheticEvent, problemId: string) {
    e.preventDefault(); // probably superfluous
    e.stopPropagation(); // necessary to stop navigation to the problem
    await deleteProblem(problemId);
    if (!onDelete) throw new Error('onDelete not specified');
    await onDelete();
  }

  return (
    <div
      className="flex flex-col justify-between shadow-xl w-72 h-72 overflow-hidden rounded-xl p-2 bg-gray-500 text-black"
      onClick={onClick}
    >
      <div className="overflow-hidden h-60">
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
        <button
          className="w-4/5 px-4 py-1 bg-red-800 rounded-md m-4 shadow-lg"
          onClick={(e) => deleteAction(e, problem.id)}
        >
          Discard
        </button>
      </div>
    </div>
  );
}

export function ProblemPanelLoading() {
  return (
    <div className="flex flex-col justify-between shadow-xl w-72 h-72 overflow-hidden rounded-xl p-2 bg-gray-300 text-black animate-pulse mx-6"></div>
  );
}
