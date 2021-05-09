import EditProblem from '../components/problem_edit';
import useUser from '../utils/hooks';

export default function NewProblemPage() {
  useUser();
  return <EditProblem problem={null} returnUrl="/" />;
}
