import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FaTrash } from 'react-icons/fa';
import { deleteProblem, firebaseAuth } from '../../utils/data_connectivity';
import { Problem } from '../../utils/types';
import { useRouter } from 'next/router';

interface ProblemPanelInterface {
  onClick: () => void; // tODO: think this would make more sense as a string than a function
  problem: Problem;
  onDelete?: () => void;
}

export default function ProblemPanel({ problem, onClick, onDelete }: ProblemPanelInterface) {
  const router = useRouter();
  const user = firebaseAuth.currentUser;
  async function deleteAction(e: React.SyntheticEvent, problemId: string) {
    e.preventDefault(); // probably superfluous
    e.stopPropagation(); // necessary to stop navigation to the problem
    await deleteProblem(user.uid, problem);
    if (!onDelete) throw new Error('onDelete not specified');
    await onDelete();
  }

  return (
    <div
      className="flex flex-col justify-between shadow-xl w-72 h-72 overflow-hidden rounded-sm p-2 bg-gray-500 text-black"
      onClick={onClick}
    >
      <div className="overflow-hidden h-60">
        <div className="flex">
          <h3 className="font-bold flex-grow">Problem</h3>
          <button
            className="flex-grow-0 rounded-sm py-1 px-2 bg-orange-800 text-gray-200 shadow-md active:shadow-none focus:outline-none"
            onClick={(e) => deleteAction(e, problem.id)}
          >
            <FaTrash />
          </button>
        </div>

        <div>
          <ReactMarkdown>{problem.problem}</ReactMarkdown>
        </div>
        {!!problem.notes.trim().length && (
          <>
            <h3 className="font-bold mt-4">Notes</h3>
            <div>
              <ReactMarkdown>{problem.notes}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
      <div className="mt-4 justify-self-end">
        <button
          className="w-4/5 px-4 py-1 bg-purple-800 rounded-sm m-4 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/define_solution/${problem.id}`);
          }}
        >
          Define Solution
        </button>
      </div>
    </div>
  );
}

interface ProblemPanelLoadingInterface {
  delay?: number;
}
export function ProblemPanelLoading({ delay = 0 }: ProblemPanelLoadingInterface) {
  return (
    <div
      className="flex flex-col justify-between shadow-xl w-72 h-72 overflow-hidden rounded-sm p-2 bg-gray-500 text-black animate-pulse mx-6"
      style={{ animationFillMode: 'backwards', animationDelay: `${delay}ms` }}
    ></div>
  );
}

export const panelWidth = 288;
export const panelHeight = 288;
