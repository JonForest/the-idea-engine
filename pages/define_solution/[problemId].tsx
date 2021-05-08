import { useRouter } from 'next/router';
import useSWR from 'swr';
import { retrieveProblem } from '../../utils/data_connectivity';

export default function DefineSolutionPage() {
  const router = useRouter();
  const problemId = router.query.problemId;
  const returnUrl = (router.query.returnUrl as string) || '/';
  const { data, error } = useSWR(problemId, retrieveProblem);


  return (
    <>
      {data && <h1>{data.problem}</h1>}
    </>
  )
}
