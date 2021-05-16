import { useRouter } from 'next/router';
import useSWR from 'swr';
import EditProblem from '../../components/problem_edit';
import { retrieveProblem } from '../../utils/data_connectivity';
import useUser from '../../utils/hooks';

export default function EditProblemPage() {
  const { user } = useUser();
  const router = useRouter();
  const problemId = router.query.problemId as string;
  const returnUrl = (router.query.returnUrl as string) || '/';
  const { data, error } = useSWR(problemId + user?.uid, () => retrieveProblem(user?.uid, problemId));

  return <EditProblem isLoading={!data} problem={data} returnUrl={returnUrl} />;
}
