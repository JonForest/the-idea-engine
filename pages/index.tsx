import Head from 'next/head';
import Button from '../components/button';
import Link from 'next/link';
import Banner from '../components/banner';
import ProblemPanel from '../components/problem-panel';
import Layout from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <div className='flex flex-column w-full'>
        <Link href='/new_problem'>
          <a className='w-full flex justify-center'>
            <button className='w-full border-black bg-green-700 text-white text-2xl p-4 rounded-xl shadow-2xl'>
              Log a problem
            </button>
          </a>
        </Link>
      </div>
      <div className='mt-8'>
        <h2> Today's problems</h2>
        <div>
          {/* Panels */}
          <ProblemPanel />
        </div>
      </div>
    </Layout>
  );
}
