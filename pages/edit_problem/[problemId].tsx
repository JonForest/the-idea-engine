import { useRouter } from 'next/router';
import useSWR from 'swr';
import EditProblem from '../../components/problem_edit';
import { retrieveProblem } from '../../utils/data_connectivity';
import useUser from '../../utils/hooks';

export default function EditProblemPage() {
  useUser();
  const router = useRouter();
  const problemId = router.query.problemId;
  const returnUrl = (router.query.returnUrl as string) || '/';
  const { data, error } = useSWR(problemId, retrieveProblem);

  return <EditProblem isLoading={!data} problem={data} returnUrl={returnUrl} />;
}
