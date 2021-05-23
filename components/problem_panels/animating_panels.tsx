import { useState, useRef, useEffect } from 'react';
import ProblemPanel, { panelWidth } from './problem_panel';
import { useGesture } from 'react-use-gesture';
import { useLeft } from '../../utils/hooks';
import { motion, animate, motionValue } from 'framer-motion';
import { Problem } from '../../utils/types';
const panelMargin = 72;

export interface PanelDisplayInterface {
  problems: Problem[],
  onDelete: () => void,
  onClick:  (problemId: string) => void,
}

export default function AnimatingPanels({ problems, onDelete, onClick }: PanelDisplayInterface) {
  const left = useLeft(panelWidth, 50);
  const [selectedPanelIndex, setSelectedPanelIndex] = useState<number>(0);
  const draggableRef = useRef(null);
  const animatedControlsRef = useRef(null);

  let x = useRef(motionValue(0));

  useEffect(() => {
    if (window) {
      x.current.set(left);
    }
  }, [left]);

  useEffect(() => {
    if (!problems) return;

    if (selectedPanelIndex >= problems.length) {
      animatedControlsRef.current = returnAnimate(problems.length - 1);
    }
  }, [problems]);

  const bind = useGesture(
    {
      onDrag: ({ event, movement: [mx, my] }) => {
        event.stopPropagation();
        event.preventDefault();
        // Stop any current animations
        animatedControlsRef.current && animatedControlsRef.current();

        x.current.set(mx);
      },
      onDragEnd: ({ event }) => {
        // Fetch list of values showing the amount of the panel showing on screen
        const offsetLeft = x.current.get();
        let showingProblemIndex = Math.round(-offsetLeft / (panelWidth + panelMargin));
        if (showingProblemIndex >= problems.length) showingProblemIndex = problems.length - 1;
        if (showingProblemIndex < 0) showingProblemIndex = 0;

        animatedControlsRef.current = returnAnimate(showingProblemIndex);
      },
    },
    {
      drag: {
        filterTaps: true,
        initial: () => [x.current.get(), 0],
      },
    }
  );

  /**
   * Wherever the panels are now, animate the showing panel back to the middle of the screen
   */
  function returnAnimate(showingPanel: number) {
    if (showingPanel < 0) return

    setSelectedPanelIndex(showingPanel);
    const targetOffset = showingPanel * -((panelWidth + panelMargin)) + left;

    const controls = animate(x.current.get(), targetOffset, {
      type: 'spring',
      stiffness: 70,
      onUpdate: (value) => {
        x.current.set(value);
      },
      onComplete: () => {},
    });
    return () => controls.stop();
  }

  return (
    <div className="flex relative h-80">
      <motion.div
        style={{ touchAction: 'pan-y', x: x.current }}
        className="flex absolute"
        ref={draggableRef}
        {...bind()}
      >
        {problems &&
          problems.map((problem, index) => (
            <span id={problem.id} key={problem.id} className="block ml-9 mr-9 first:ml-0">
              <ProblemPanel
                problem={problem}
                onClick={() => onClick(problem.id)}
                onDelete={onDelete}
              />
            </span>
          ))}
      </motion.div>
    </div>
  );
}
