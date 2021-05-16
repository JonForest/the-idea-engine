import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import { usePrevious } from '../utils/hooks';

interface AnimatedBadgeInterface {
  targetValue: number;
}
export default function AnimatedBadge({ targetValue }: AnimatedBadgeInterface) {
  const ref = useRef();

  const previousValue = usePrevious(targetValue) || 0
  console.log('target, previous', targetValue, previousValue)

  useEffect(() => {
    // Quick function to make the duration bigger as have a bigger gap, but not log, not linear
    // Maths.abs - make every number positive
    // + 1 - to ensure we don't get Math.log(0), which is -Infinity, Math.log(x) x < 1, which is negative values
    const duration = 0.5 + (Math.log(Math.abs(targetValue - previousValue) + 1) / 4)

    const controls = animate(previousValue, targetValue, {
      duration,
      onUpdate(value) {
        const current = ref.current
        if (current !== undefined) {
          // @ts-ignore: Object is possibly 'null'.
          current.textContent = value.toFixed(0);
        }
      },
    });
    return () => controls.stop();
  }, [previousValue, targetValue]);

  return <span className="text-4xl mr-4 border-purple-700 border-4 px-4 py-2 rounded-full" ref={ref} />;
}
