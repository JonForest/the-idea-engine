import Head from 'next/head';
import Button from '../components/button';
import Link from 'next/link';
import Banner from '../components/banner';
import ProblemPanel from '../components/problem-panel';
import Layout from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <Banner />

      <div className='flex flex-row mt-8'>
        <div className='w-8 flex-none'>{/* Left column */}</div>
        <div className='flex-grow'>
          <div className='flex flex-column w-full'>
            <Link href='/new_problem'>
              <a className='w-full flex justify-center'>
                <Button>Log a problem</Button>
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
        </div>
        <div className='w-8 flex-none'>{/* Right column */}</div>
      </div>
    </Layout>

  );
}
