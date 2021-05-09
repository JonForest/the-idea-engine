import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import BufferedContent from '../components/buffered_content';
import Layout from '../components/layout';
import ProblemPanel, { ProblemPanelLoading } from '../components/problem_panel';
import { retrieveProblemRange } from '../utils/data_connectivity';
import useUser from '../utils/hooks';
import { DateRanges } from '../utils/types';

export default function ReviewProblems() {
  const { user } = useUser();
  const router = useRouter();
  const range = (router.query.range as DateRanges) || null;
  const [dateKey, setDateKey] = useState<DateRanges>(DateRanges.TODAY);
  useEffect(() => {
    if (!range) return;
    setDateKey(range);
  }, [range, dateKey]);
  const { data, error } = useSWR(dateKey + user?.uid, () => retrieveProblemRange(user.uid, dateKey));
  const isLoading = !data;
  const selected = 'pb-1 border-b-4 border-purple-600';

  return (
    <Layout>
      <BufferedContent>
        <div>
          <h1 className="block">Review problems</h1>
          <div>
            <button
              onClick={() => router.push(`/review_problems?range=${DateRanges.TODAY}`, undefined, { shallow: true })}
              className={`focus:outline-none text-sm ${dateKey === DateRanges.TODAY && selected}`}
            >
              Today
            </button>
            <button
              onClick={() =>
                router.push(`/review_problems?range=${DateRanges.LAST_SEVEN_DAYS}`, undefined, { shallow: true })
              }
              className={`focus:outline-none text-sm mx-4 ${dateKey === DateRanges.LAST_SEVEN_DAYS && selected}`}
            >
              Last 7 days
            </button>
            <button
              onClick={() => router.push(`/review_problems?range=${DateRanges.ALL}`, undefined, { shallow: true })}
              className={`focus:outline-none text-sm ${dateKey === DateRanges.ALL && selected}`}
            >
              All time
            </button>
          </div>
        </div>
      </BufferedContent>
      <BufferedContent>
        <div>
          {isLoading && (
            <div className="flex flow-hidden relative h-80 mt-8">
              <ProblemPanelLoading /> <ProblemPanelLoading delay={150} />
            </div>
          )}
          {!isLoading && (
            <div className="flex flex-wrap h-80 mt-8 justify-center md:justify-start">
              {data &&
                data.map((problem) => (
                  <div key={problem.id} className="m-6">
                    <ProblemPanel
                      problem={problem}
                      onClick={() =>
                        router.push(`edit_problem/${problem.id}?returnUrl=/review_problems?range=${dateKey}`)
                      }
                      onDelete={() => mutate(dateKey + user.uid)}
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
