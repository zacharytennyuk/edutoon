import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const P5Canvas = ({ imageUrl, summary, quadrant }) => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let img;

      p.preload = () => {
        img = p.loadImage(imageUrl);
      };

      p.setup = () => {
        p.createCanvas(1024, 1024);
      };

      p.draw = () => {
        p.background(255);

        // Calculate the coordinates for the selected quadrant
        const quadrantCoords = {
          1: { x: 0, y: 0 },
          2: { x: 1024, y: 0 },
          3: { x: 0, y: 1024 },
          4: { x: 1024, y: 1024 }
        };

        const { x, y } = quadrantCoords[quadrant] || { x: 0, y: 0 };

        // Draw the selected quadrant of the image
        p.image(img, 0, 0, p.width, p.height, x, y, 1024, 1024);

        // Define the bubble dimensions and position
        let bubbleWidth = p.width * 0.8;
        let bubbleHeight = 150;
        let bubbleX = (p.width - bubbleWidth) / 2;
        let bubbleY = 20;

        // Draw the bubble
        p.fill(255);
        p.stroke(0);
        p.strokeWeight(2);
        p.rect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 20);

        // Draw the text
        p.fill(0);
        p.noStroke();
        p.textSize(16);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(summary || 'SUMMARY MISSING!', bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2);
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => {
      p5Instance.remove();
    };
  }, [imageUrl, summary, quadrant]);

  return <div ref={sketchRef}></div>;
};

export default P5Canvas;
