import React, { useRef, useEffect, useCallback, useState } from "react";

interface Transmission {
  onClick: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, hueCanvasPosition: number) => void;
}

const HueMap: React.FC<Transmission> = (props) => {
  const hueCanvasRef = useRef<HTMLCanvasElement | null>(null);
  // this uses for handleClick to get position data
  const [hueCanvasPosition, setHueCanvasPosition] = useState(0);

  useEffect(() => {
    // render hue map for the first time
    const hueCanvas = hueCanvasRef.current;
    if (hueCanvas === null) return;
    const ctx = hueCanvas.getContext("2d");
    
    let hueGradient = (ctx as CanvasRenderingContext2D).createLinearGradient(0, 0, 0, 240);
    hueGradient.addColorStop(0, "#FF0000");
    hueGradient.addColorStop(1 / 6, "#FF00FF");
    hueGradient.addColorStop(2 / 6, "#0000FF");
    hueGradient.addColorStop(3 / 6, "#00FFFF");
    hueGradient.addColorStop(4 / 6, "#00FF00");
    hueGradient.addColorStop(5 / 6, "#FFFF00");
    hueGradient.addColorStop(1, "#FF0000");

    (ctx as CanvasRenderingContext2D).fillStyle = hueGradient;
    (ctx as CanvasRenderingContext2D).fillRect(0, 0, 20, 240);
    const hueCanvasTop = hueCanvas.offsetTop + hueCanvas.clientTop;
    setHueCanvasPosition(hueCanvasTop);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, hueCanvasPosition: number) => {
    props.onClick(e, hueCanvasPosition);
  }, []);

  return (
    <canvas
      id="hue-map"
      width="20"
      height="240"
      ref={hueCanvasRef}
      onClick={(e) => handleClick(e, hueCanvasPosition)}
    ></canvas>
  );
};

export default HueMap;
