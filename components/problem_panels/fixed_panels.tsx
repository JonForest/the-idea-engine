import { useRouter } from 'next/router';
import { useLeft } from '../../utils/hooks';
import ProblemPanel, { panelWidth } from './problem_panel';
import { PanelDisplayInterface } from './animating_panels';

export default function FixedPanels({ problems, onDelete, onClick }: PanelDisplayInterface) {
  const left = useLeft(panelWidth, 50);
  const router = useRouter();
  return (
    <div className="flex flex-wrap h-80 justify-center md:justify-start" style={{ marginLeft: left }}>
      {problems &&
        problems.map((problem, index) => (
          <span id={problem.id} key={problem.id} className="block mx-9 my-6">
            <ProblemPanel problem={problem} onClick={() => onClick(problem.id)} onDelete={onDelete} />
          </span>
        ))}
    </div>
  );
}
