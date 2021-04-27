import Link from 'next/link';
import ProblemPanel from '../components/problem_panel';
import Layout from '../components/layout';
import BufferedContent from '../components/buffered_content'
import React, { useState } from 'react';

const panels = [1,2,3,4,5]

export default function Home() {
  const [selectedPanelIndex, setSelectedPanelIndex] = useState<number>(1)

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
            {panels.map((panel, index) => (

            <div style={{ position: 'absolute', left: `${(((index - selectedPanelIndex) * 280) + 90)}px` }}>
              <ProblemPanel onClick={() => setSelectedPanelIndex(index)}/>
            </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
