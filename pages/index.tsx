import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ProblemPanel from '../components/problem_panel';
import Layout from '../components/layout';
import BufferedContent from '../components/buffered_content';
import { retrieveProblems } from '../utils/data_connectivity';
import { useGesture } from 'react-use-gesture';
import EventEmitter from 'node:events';

const panels = [1, 2, 3, 4, 5];

export default function Home({ problems }) {
  const [selectedPanelIndex, setSelectedPanelIndex] = useState<number>(0);
  const router = useRouter();
  const [offsetPosition, setOffsetPosition] = useState<number>(0);
  // const panelsRef = useRef();

  const bind = useGesture(
    {
      onDrag: ({ event, movement: [mx, my] }) => {
        // console.log(event);
        // event.preventDefault();
        event.stopPropagation();
        event.preventDefault()
        console.log(event)
        console.log(mx,my)
        setOffsetPosition(mx)
      },
      onDragEnd: ({event}) => {
        console.log('drag ending')
      }
    },
    {
      // eventOptions: { passive: false },
      drag: {
        filterTaps: true,
        initial: () => [offsetPosition, 0]
      }
    }
  );

  return (
    <Layout>
      <BufferedContent>
        <Link href="/new_problem">
          <a className="w-full flex justify-center">
            <button className="w-full border-black bg-green-700 text-white text-2xl p-4 rounded-xl shadow-2xl">
              Log a problem
            </button>
          </a>
        </Link>
      </BufferedContent>

      <div className="mt-12">
        <BufferedContent>
          <h2 className="text-xl mb-8"> Today's problems</h2>
        </BufferedContent>
        <div>
          {/* Panels */}
          <div className="flex overflow-hidden relative h-80">
            {problems.map((problem, index) => (
              <div
                key={problem.id}
                className="border-black border-solid border-2"
                style={{ position: 'absolute', left: `${(index - selectedPanelIndex) * 280 + 90 + offsetPosition}px` }}
                {...bind()}
              >
                <ProblemPanel
                  problem={problem}
                  onClick={() =>
                    index === selectedPanelIndex ? router.push(`edit_problem/${problem.id}`): setSelectedPanelIndex(index)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const problems = await retrieveProblems();
  return {
    props: { problems }, // will be passed to the page component as props
  };
};


//     <ProblemPanel
// problem={problem}
// onClick={() =>
//   index === selectedPanelIndex
//     ? router.push(`edit_problem/${problem.id}`)
//     : setSelectedPanelIndex(index)
// }