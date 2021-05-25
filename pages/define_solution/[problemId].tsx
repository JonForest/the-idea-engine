import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import BufferedContent from '../../components/buffered_content';
import Layout from '../../components/layout';
import ProgressStep from '../../components/progress_step';
import { retrieveProblem, saveRootCause } from '../../utils/data_connectivity';
import { retrieveSolutions, saveSolution } from '../../utils/data_connectivity/solutions';
import useUser from '../../utils/hooks';
import { Solution } from '../../utils/types';

enum Section {
  ROOTCAUSE = 'rootcause',
  GENERATEIDEAS = 'generateideas',
}

export default function DefineProblemPage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<Section>(Section.ROOTCAUSE);
  const [rootCause, setRootCause] = useState<string>('');
  const [currentSolution, setCurrentSolution] = useState<string>('');
  const problemId = router.query.problemId as string;
  const { data: problem, error } = useSWR(problemId + user?.uid, () => retrieveProblem(user?.uid, problemId));
  const { data: solutions, error: solutionError } = useSWR('solutions' + problemId + user?.uid, () => retrieveSolutions(user?.uid, problemId));

  const isSubmittable = !!rootCause.trim();
  const isCurrentSolutionSubmittable = !!currentSolution.trim();

  useEffect(() => {
    if (problem) {
      setRootCause(problem?.rootCause || '');
    }
  }, [problem]);

  async function handleRootCauseSave(e) {
    e.preventDefault();
    await saveRootCause(user.uid, problem, rootCause);
    setCurrentSection(Section.GENERATEIDEAS);
  }

  async function handleCurrentSolutionSave(e) {
    e.preventDefault();
    if (currentSolution.trim() === '') return

    const solution: Partial<Solution> = {
      problemId: problem.id,
      description: currentSolution,
    }
    await saveSolution(user.uid, solution);
    mutate('solutions' + problemId + user?.uid)
    setCurrentSolution('')
  }

  return (
    <Layout>
      <BufferedContent>
        <ul className="list-none w-full">
          <ProgressStep title="Problem" isLoading={!problem}>
            {problem?.problem}
          </ProgressStep>
          <ProgressStep
            title="Root cause analysis"
            isLoading={false}
            isCurrent={currentSection === Section.ROOTCAUSE}
            clickAction={() => setCurrentSection(Section.ROOTCAUSE)}
          >
            {currentSection === Section.ROOTCAUSE ? (
              <>
                <textarea
                  className="w-full h-80 lg:h-60 text-gray-800"
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                />
                <button
                  type="button"
                  disabled={!isSubmittable}
                  onClick={handleRootCauseSave}
                  className={`w-full text-xl px-4 py-1 rounded-sm ${
                    isSubmittable ? ' bg-green-700 text-white shadow-md' : ' bg-gray-600 text-gray-200'
                  }`}
                >
                  Save
                </button>
              </>
            ) : (
              rootCause
            )}
          </ProgressStep>
          <ProgressStep
            title="Generate ideas"
            isLoading={false}
            isCurrent={currentSection == Section.GENERATEIDEAS}
            clickAction={() => setCurrentSection(Section.GENERATEIDEAS)}
          >
            {currentSection === Section.GENERATEIDEAS && (<>
                <textarea
                  className="w-full h-80 lg:h-60 text-gray-800"
                  value={currentSolution}
                  onChange={(e) => setCurrentSolution(e.target.value)}
                />
                <button
                  type="button"
                  disabled={!isCurrentSolutionSubmittable}
                  onClick={handleCurrentSolutionSave}
                  className={`w-full text-xl px-4 py-1 rounded-sm ${
                    isCurrentSolutionSubmittable ? ' bg-green-700 text-white shadow-md' : ' bg-gray-600 text-gray-200'
                  }`}
                >
                  Save
                </button>
              </>
            )}

            {solutions && solutions.map(solution => <div key={solution.id}>{solution.description}</div>)}

          </ProgressStep>
        </ul>
      </BufferedContent>
    </Layout>
  );
}
