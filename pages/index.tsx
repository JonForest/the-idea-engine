import React, { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ProblemPanel from '../components/problem_panel';
import Layout from '../components/layout';
import BufferedContent from '../components/buffered_content';
import { fetchProblemStats, getToday, retrieveProblems } from '../utils/data_connectivity';
import { useGesture } from 'react-use-gesture';
import useUser, { useLeft, useRefArray } from '../utils/hooks';
import AnimatedBadge from '../components/animated_badge';
import { animate } from 'framer-motion';

export default function Home() {
  const { user } = useUser();
  const panelWidth = 288;
  const [selectedPanelIndex, setSelectedPanelIndex] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(414); // default iPhone 6/7/8
  const router = useRouter();
  const [offsetPosition, setOffsetPosition] = useState<number>(0);
  const today = getToday();
  const { data } = useSWR(today + user?.uid, () => retrieveProblems(user?.uid, today));
  const { data: stats } = useSWR(user?.uid, () => fetchProblemStats(user?.uid));
  const left = useLeft(panelWidth);
  const refs = useRefArray();

  useEffect(() => {
    if (window) setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (!data) return;

    if (selectedPanelIndex >= data.length) {
      console.log('Reset the offset');
      returnAnimate(data.length - 1);
    }
  }, [data]);

  const bind = useGesture(
    {
      onDrag: ({ event, movement: [mx, my] }) => {
        event.stopPropagation();
        event.preventDefault();
        setOffsetPosition(mx);
      },
      onDragEnd: ({ event }) => {
        // Fetch list of values showing the amount of the panel showing on screen
        const pixelsDisplaying = refs.current.map((item) => {
          let showingPixels = panelWidth;
          const itemLeft = item.offsetLeft;

          if (itemLeft < 0) showingPixels += itemLeft; // itemLeft is negative, so using a + will still reduce showingPixels

          const overhang = itemLeft + panelWidth - windowWidth;
          if (overhang > 0) showingPixels -= overhang;
          return showingPixels;
        });
        const showingProblemIndex = pixelsDisplaying.indexOf(Math.max(...pixelsDisplaying));
        return returnAnimate(showingProblemIndex);
      },
    },
    {
      drag: {
        filterTaps: true,
        initial: () => [offsetPosition, 0],
      },
    }
  );

  /**
   * Wherever the panels are now, animate the showing panel back to the middle of the screen
   */
  function returnAnimate(showingPanel: number) {
    setSelectedPanelIndex(showingPanel);

    const targetOffset = showingPanel * -(panelWidth + 50);

    const controls = animate(offsetPosition, targetOffset, {
      type: 'spring',
      stiffness: 70,
      onUpdate: (value) => {
        console.log(value);
        setOffsetPosition(value);
      },
      onComplete: () => {},
    });
    return () => controls.stop();
  }

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
            <div className="mt-10">
              <AnimatedBadge targetValue={stats.rootCauseProblems} /> Root cause identified
            </div>
            <div className="mt-12">
              <AnimatedBadge targetValue={stats.totalProblems - stats.rootCauseProblems} /> Unclassified problems
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
          <div className="flex overflow-hidden relative h-80">
            {data &&
              data.map((problem, index) => (
                <div
                  id={problem.id}
                  key={problem.id}
                  ref={refs}
                  style={{
                    touchAction: 'pan-y',
                    position: 'absolute',
                    left: `${index * 330 + left + offsetPosition}px`,
                  }}
                  {...bind()}
                >
                  <ProblemPanel
                    problem={problem}
                    onClick={() => router.push(`edit_problem/${problem.id}`)}
                    onDelete={() => {
                      mutate(today + user.uid);
                      mutate(user.uid);
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
