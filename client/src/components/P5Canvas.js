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
        let bubbleX = (p.width - bubbleWidth) / 2;
        let textSize = 16;

        // Set text properties
        p.textSize(textSize);
        p.textAlign(p.LEFT, p.TOP);
        p.fill(0);
        p.noStroke();

        // Sample text
        let textContent = `Dr. Rachel: “Exactly. Our research is just the beginning. We need ongoing efforts to adapt as technology evolves. Protecting user privacy in the digital landscape is an ever-moving target.”

        
Dr. Tadayoshi: “Let’s schedule a meeting with stakeholders next week. We’ll present our findings and push for 
immediate action.”

Dr. Rachel: “Agreed. The sooner we act, the better we can safeguard personal information in this rapidly advancing 





digital age.”` || 'SUMMARY MISSING!';

        // Calculate wrapped text height
        let words = textContent.split(' ');
        let lineHeight = textSize * 1.5;  // Increase line height to ensure enough space between lines
        let lines = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
          let testLine = currentLine + words[i] + ' ';
          if (p.textWidth(testLine) > bubbleWidth - 40) {
            lines.push(currentLine);
            currentLine = words[i] + ' ';
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);

        let wrappedTextHeight = lines.length * lineHeight;

        // Adjust bubble height based on text height
        let bubbleHeight = wrappedTextHeight + 150; // Add padding

        // Position the bubble at the bottom of the canvas
        let bubbleY = p.height - bubbleHeight - 40;

        // Draw the bubble
        p.fill(255);
        p.stroke(0);
        p.strokeWeight(2);
        p.rect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 20);

        // Draw the text
        p.fill(0);
        p.noStroke();
        p.textAlign(p.LEFT, p.TOP);
        let textY = bubbleY + 20;
        lines.forEach((line) => {
          p.text(line, bubbleX + 20, textY);
          textY += lineHeight;
        });
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
