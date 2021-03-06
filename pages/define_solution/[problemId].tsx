import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import BufferedContent from '../../components/buffered_content';
import Layout from '../../components/layout';
import ProgressStep from '../../components/progress_step';
import SolutionPanel from '../../components/solution/solution_panel';
import { retrieveProblem, saveRootCause } from '../../utils/data_connectivity';
import { retrieveSolutions } from '../../utils/data_connectivity/solutions';
import useUser from '../../utils/hooks';

enum Section {
  ROOTCAUSE = 'rootcause',
  GENERATEIDEAS = 'generateideas',
}

export default function DefineProblemPage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<Section>(Section.ROOTCAUSE);
  const [rootCause, setRootCause] = useState<string>('');
  const problemId = router.query.problemId as string;
  const { data: problem, error } = useSWR(problemId + user?.uid, () => retrieveProblem(user?.uid, problemId));
  const {
    data: solutions,
    error: solutionError,
    mutate: mutateSolutions,
  } = useSWR('solutions' + problemId + user?.uid, () => retrieveSolutions(user?.uid, problemId));

  const isSubmittable = !!rootCause.trim();

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

  return (
    <Layout>
      <BufferedContent>
        <ul className="list-none w-full mb-8">
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
            {currentSection === Section.GENERATEIDEAS && (
              <SolutionPanel
                solution={{ problemId: problem.id }}
                onDelete={() => undefined /* no-op*/}
                onSave={() => mutateSolutions()}
              />
            )}

            {solutions &&
              solutions.map((solution) => (
                <div key={solution.id} className="mt-8 first:mt-1">
                  <SolutionPanel
                    solution={solution}
                    onDelete={() => mutateSolutions()}
                    onSave={() => mutateSolutions()}
                  />
                </div>
              ))}
          </ProgressStep>
        </ul>
      </BufferedContent>
    </Layout>
  );
}
