import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { BaseSyntheticEvent, SyntheticEvent, useState } from 'react';
import Layout from '../components/layout';
import BufferedContent from '../components/buffered_content';

export default function NewProblemPage() {
  const [formVals, setFormVals] = useState<{ problem: string; notes: string }>({ problem: '', notes: '' });
  const router = useRouter();
  const isSubmittable = formVals.problem.trim() !== '';

  function saveForm(e: BaseSyntheticEvent) {
    e.preventDefault();
    const problem = e.target.problem;

    // No error logged, as this shouldn't be able to happeb
    if (formVals.problem.trim() === '') return;

    // todo: save

    router.push('/');
  }

  return (
    <Layout>
      <BufferedContent>
        <form onSubmit={saveForm} className="flex flex-col w-full" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="flex flex-col">
            <label className="block" htmlFor="problem">
              What is the problem?
            </label>
            <textarea
              id="problem"
              name="problem"
              value={formVals.problem}
              className="w-full h-60 border-0 text-sm rounded-sm resize-none"
              onChange={(e) => setFormVals({ ...formVals, problem: e.target.value })}
            ></textarea>
          </div>
          <div className="mt-8">
            <label className="block" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formVals.notes}
              className="w-full h-60 border-0 text-sm rounded-sm resize-none"
              onChange={(e) => setFormVals({ ...formVals, notes: e.target.value })}
            ></textarea>
          </div>
          <div className="flex-grow"></div>
          <div>
            <Link href="/">
              <a className="box-border inline-block pr-3 w-1/2 underline">
                <button className="w-full bg-blue-200 text-black text-xl px-4 py-1 rounded-sm shadow-md">Cancel</button>
              </a>
            </Link>
            <div className="inline-block box-border pl-3 w-1/2">
              <button
                type="submit"
                disabled={!isSubmittable}
                className={`w-full text-xl px-4 py-1 rounded-sm ${
                  isSubmittable ? ' bg-green-700 text-white shadow-md' : ' bg-gray-600 text-gray-200'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </BufferedContent>
    </Layout>
  );
}
