import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import Layout from '../components/layout';
import BufferedContent from '../components/buffered_content';
import { getToday, saveProblem } from '../utils/data_connectivity';
import { Problem } from '../utils/types';

interface EditProblemInterface {
  problem: Problem | null;
  returnUrl: string;
  isLoading?: boolean;
}

export default function EditProblem({ isLoading = false, problem, returnUrl }: EditProblemInterface) {
  const router = useRouter();
  const [formVals, setFormVals] = useState<Partial<Problem>>({ problem: '', notes: '', isProcessed: false });

  useEffect(() => {
    if (!problem) return;
    setFormVals(problem);
  }, [problem]);

  const isSubmittable = formVals.problem.trim() !== '';

  /**
   * Function to save the problem
   */
  async function saveForm(e: SyntheticEvent) {
    e.preventDefault();

    // No error logged, as this shouldn't be able to happeb
    if (formVals.problem.trim() === '') return;

    const problem = {
      ...formVals,
      date: getToday(),
    };

    // todo: save
    await saveProblem(problem);

    router.push('/');
  }

  const loadingClasses = isLoading ? ' bg-gray-300 animate-pulse ' : '';

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
              disabled={isLoading}
              value={formVals.problem}
              className={`w-full h-60 border-0 text-gray-800 text-sm md:text-md lg:text-lg rounded-sm resize-none ${loadingClasses}`}
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
              disabled={isLoading}
              value={formVals.notes}
              className={`w-full h-60 border-0 text-gray-800 text-sm md:text-md lg:text-lg rounded-sm resize-none ${loadingClasses}`}
              onChange={(e) => setFormVals({ ...formVals, notes: e.target.value })}
            ></textarea>
          </div>
          <div className="flex-grow"></div>
          <div>
            <Link href={returnUrl}>
              <a className="box-border inline-block pr-3 w-1/2 underline">
                <button className="w-full bg-blue-200 text-black text-xl px-4 py-1 rounded-sm shadow-md">Cancel</button>
              </a>
            </Link>
            <div className="inline-block box-border pl-3 w-1/2 mb-4">
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
