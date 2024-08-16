import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const P5Canvas = ({ imageUrl, characterImageUrl, onComplete }) => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let img;
      let characterImg;

      p.preload = () => {
        img = p.loadImage(imageUrl);
        characterImg = p.loadImage(characterImageUrl);
      };

      p.setup = () => {
        p.createCanvas(1024, 1024);
      };

      p.draw = () => {
        p.background(255);

        // Draw the top quadrant of the background image
        p.image(img, 0, 0, 1024, 1024, 0, 0, img.width / 2, img.height / 2);

        // Draw the character image centered on the canvas but start a third of the way down
        const characterWidth = 1024;
        const characterHeight = 1024;
        const characterX = (p.width - characterWidth) / 2;
        const characterY = p.height / 6; // Start drawing one-third down the canvas
        p.image(characterImg, characterX, characterY, characterWidth, characterHeight);

        // Convert the canvas to an image and pass it to the parent component
        const canvasData = p.canvas.toDataURL('image/png');
        onComplete(canvasData);

        p.noLoop(); // Stop the draw loop once the image is processed
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => {
      p5Instance.remove();
    };
  }, [imageUrl, characterImageUrl, onComplete]);

  return <div ref={sketchRef}></div>;
};

export default P5Canvas;
