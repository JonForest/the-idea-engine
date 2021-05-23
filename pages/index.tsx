import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';

import Layout from '../components/layout';
import BufferedContent from '../components/buffered_content';
import { fetchProblemStats, getToday, retrieveProblems } from '../utils/data_connectivity';
import useUser, { useIsScrollable } from '../utils/hooks';
import AnimatedBadge from '../components/animated_badge';
import AnimatingPanels from '../components/problem_panels/animating_panels';
import FixedPanels from '../components/problem_panels/fixed_panels';

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const isScrollable = useIsScrollable();
  const today = getToday();
  const { data: problems } = useSWR(today + user?.uid, () => retrieveProblems(user?.uid, today));
  const { data: stats } = useSWR(user?.uid, () => fetchProblemStats(user?.uid));

  return (
    <Layout>
      <BufferedContent>
        <Link href="/new_problem">
          <a className="w-full flex justify-center">
            <button className="w-full border-black bg-purple-800 text-gray-100 text-2xl p-4 rounded-sm shadow-2xl">
              Log a problem
            </button>
          </a>
        </Link>
      </BufferedContent>
      <BufferedContent>
        {stats && (
          <div className="flex flex-col text-2xl">
            <div className="mt-10 flex">
              <AnimatedBadge targetValue={stats.rootCauseProblems} /> <span>Root cause identified</span>
            </div>
            <div className="mt-12 flex">
              <AnimatedBadge targetValue={stats.totalProblems - stats.rootCauseProblems} /> <span>Unclassified problems</span>
            </div>
          </div>
        )}
      </BufferedContent>

      <div className="mt-12">
        <BufferedContent>
          <h2 className="text-xl mb-8">Today's problems</h2>
        </BufferedContent>
        <div>
          {/* Panels */}
          {isScrollable ? (
            <AnimatingPanels
              problems={problems}
              onClick={(problemId) => router.push(`edit_problem/${problemId}`)}
              onDelete={() => {
                mutate(today + user.uid);
                mutate(user.uid);
              }}
            />
          ) : (
            <FixedPanels
              problems={problems}
              onClick={(problemId) => router.push(`edit_problem/${problemId}`)}
              onDelete={() => {
                mutate(today + user.uid);
                mutate(user.uid);
              }}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
