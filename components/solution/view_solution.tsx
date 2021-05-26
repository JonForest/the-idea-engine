import React from 'react';
import { FaTrash } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { deleteSolution } from '../../utils/data_connectivity/solutions';
import useUser from '../../utils/hooks';
import { Solution } from '../../utils/types';

interface ViewSolutionInterface {
  solution: Partial<Solution>;
  onDelete: () => void;
}

export default function ViewSolution({ solution, onDelete }) {
  const { user } = useUser();

  function deleteAction(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!user.uid) return;

    deleteSolution(user.uid, solution.id);
    onDelete(solution.problemId);
  }

  return (
    <div className="flex flex-col justify-between shadow-xl w-full overflow-hidden rounded-sm p-2 bg-gray-100">
      <div className="overflow-hidden">
        <div className="flex">
        <div className="text-gray-900 flex-grow">
          <ReactMarkdown>{solution.description}</ReactMarkdown>
        </div>
          <button
            className="flex-grow-0 rounded-sm py-1 px-2 h-6 bg-orange-800 text-gray-200 shadow-md active:shadow-none focus:outline-none"
            onClick={deleteAction}
          >
            <FaTrash />
          </button>
        </div>

      </div>
    </div>
  );
}
