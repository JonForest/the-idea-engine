import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR, {mutate} from 'swr';
import BufferedContent from '../components/buffered_content';
import Layout from '../components/layout';
import ProblemPanel, { ProblemPanelLoading } from '../components/problem_panel';
import { retrieveProblemRange } from '../utils/data_connectivity';
import { DateRanges } from '../utils/types';

export default function ReviewProblems() {
  const router = useRouter()
  const [dateKey, setDateKey] = useState<DateRanges>(DateRanges.TODAY)
  const [selectedPanelIndex, setSelectedPanelIndex] = useState<number>(0);
  const {data, error} = useSWR(dateKey, retrieveProblemRange)
  const isLoading = !data;
  const selected ="pb-1 border-b-2 border-purple-700"

  /**
   * Called when a problem has been deleted
   * Mutates the SWR key such it refetches
   */
  function onProblemDelete() {
    mutate(dateKey)
  }

  return (
    <Layout>
      <BufferedContent>
        <div>
        <h1 className="block">Review problems</h1>
        <div>
          <button onClick={() => setDateKey(DateRanges.TODAY)} className={`focus:outline-none text-sm ${selected}`}>Today</button>
          <button onClick={() => setDateKey(DateRanges.LAST_SEVEN_DAYS)} className="focus:outline-none text-sm px-4">Last 7 days</button>
          <button onClick={() => setDateKey(DateRanges.ALL)} className="focus:outline-none text-sm">All time</button>
        </div>
        {isLoading && (
          <div className="flex flow-hidden relative h-80 mt-8">
            <ProblemPanelLoading /> <ProblemPanelLoading />
          </div>
        )}
      </div>
      </BufferedContent>
      <BufferedContent>
      <div>
        {!isLoading && (
          <div className="flex flex-wrap h-80 mt-8">
              {data && data.map((problem) => (
                <div
                  key={problem.id}
                  className="m-6"
                >
                  <ProblemPanel
                    problem={problem}
                    onClick={() => router.push(`edit_problem/${problem.id}`)}
                    onDelete={onProblemDelete}
                  />
                </div>
              ))}
            </div>
        )}
        </div>
      </BufferedContent>
    </Layout>
  );
}
