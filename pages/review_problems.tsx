import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import BufferedContent from '../components/buffered_content';
import Layout from '../components/layout';
import { ProblemPanelLoading } from '../components/problem_panels/problem_panel';
import AnimatingPanels from '../components/problem_panels/animating_panels';
import FixedPanels from '../components/problem_panels/fixed_panels';
import { retrieveProblemRange } from '../utils/data_connectivity';
import useUser, { useIsScrollable } from '../utils/hooks';
import { DateRanges } from '../utils/types';

export default function ReviewProblems() {
  const { user } = useUser();
  const router = useRouter();
  const isScrollable = useIsScrollable();
  const range = (router.query.range as DateRanges) || null;
  const [dateKey, setDateKey] = useState<DateRanges>(DateRanges.TODAY);
  useEffect(() => {
    if (!range) return;
    setDateKey(range);
  }, [range, dateKey]);
  const { data: problems, error } = useSWR(dateKey + user?.uid, () => retrieveProblemRange(user.uid, dateKey));
  const isLoading = !problems;
  const selected = 'pb-1 border-b-4 border-purple-600';

  return (
    <Layout>
      <BufferedContent>
        <div>
          <h1 className="block">Review problems</h1>
          <div className="mb-8">
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
        {isLoading && (
          <BufferedContent>
          <div className="flex flow-hidden relative h-80 mt-8">
            <ProblemPanelLoading /> <ProblemPanelLoading delay={150} />
          </div>
          </BufferedContent>
        )}
        {!isLoading && isScrollable && (
          <AnimatingPanels
            problems={problems}
            onClick={(problemId) =>
              router.push(`edit_problem/${problemId}?returnUrl=/review_problems?range=${dateKey}`)
            }
            onDelete={() => mutate(dateKey + user.uid)}
          />
        )}
        {!isLoading && !isScrollable && (
          <BufferedContent>
          <FixedPanels
            problems={problems}
            onClick={(problemId) =>
              router.push(`edit_problem/${problemId}?returnUrl=/review_problems?range=${dateKey}`)
            }
            onDelete={() => mutate(dateKey + user.uid)}
          />
          </BufferedContent>
        )}
    </Layout>
  );
}
