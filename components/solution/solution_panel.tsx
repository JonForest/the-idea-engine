import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { deleteSolution } from '../../utils/data_connectivity/solutions';
import useUser from '../../utils/hooks';
import { Solution } from '../../utils/types';
import { saveSolution } from '../../utils/data_connectivity/solutions';

interface SolutionPanelInterface {
  solution: Partial<Solution>;
  onDelete: () => void;
  onSave: () => void;
}

export default function SolutionPanel({ solution, onDelete, onSave }: SolutionPanelInterface) {
  const { user } = useUser();
  const [solutionDesc, setSolutionDesc] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  useEffect(() => {
    if (solution) {
      setSolutionDesc(solution.description);
      if (!solution.id) setIsEditing(true);
    }
  }, [solution]);

  const isCurrentSolutionSubmittable = !!solutionDesc?.trim();

  function deleteAction(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user.uid) return;

    deleteSolution(user.uid, solution.id);
    onDelete();
  }

  async function saveAction(e: React.SyntheticEvent) {
    e.preventDefault();
    if (solutionDesc.trim() === '') return;
    solution.description = solutionDesc;

    await saveSolution(user.uid, solution);
    setIsEditing(false);
    onSave();
  }

  return isEditing ? (
    <>
      <textarea
        className="w-full h-80 lg:h-60 text-gray-800"
        value={solutionDesc}
        onChange={(e) => setSolutionDesc(e.target.value)}
      />
      <button
        type="button"
        disabled={!isCurrentSolutionSubmittable}
        onClick={saveAction}
        className={`w-full text-xl px-4 py-1 rounded-sm ${
          isCurrentSolutionSubmittable ? ' bg-green-700 text-white shadow-md' : ' bg-gray-600 text-gray-200'
        }`}
      >
        Save
      </button>
    </>
  ) : (
    <div className="flex flex-col justify-between shadow-xl w-full overflow-hidden rounded-sm p-2 bg-gray-100">
      <button className="overflow-hidden" onClick={() => setIsEditing(true)}>
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
      </button>
    </div>
  );
}
