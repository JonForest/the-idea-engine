import { useRouter } from 'next/router';
import { userInfo } from 'node:os';
import useSWR from 'swr';
import { retrieveProblem } from '../../utils/data_connectivity';
import useUser from '../../utils/hooks';

export default function DefineSolutionPage() {
  const { user } = useUser();
  const router = useRouter();
  const problemId = router.query.problemId;
  const returnUrl = (router.query.returnUrl as string) || '/';
  const { data, error } = useSWR(problemId + user.uid, () => retrieveProblem(user.uid, problemId));

  return <>{data && <h1>{data.problem}</h1>}</>;
}
