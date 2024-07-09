import { useRef, useEffect } from 'react';
import p5 from 'p5';

const useP5 = (sketch) => {
  const sketchRef = useRef();

  useEffect(() => {
    const p5Instance = new p5(sketch, sketchRef.current);
    return () => {
      p5Instance.remove();
    };
  }, [sketch]);

  return sketchRef;
};

export default useP5;
