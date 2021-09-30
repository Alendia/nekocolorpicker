import React, { useRef, useEffect, useState, useCallback } from "react";

interface Transmission {
  hue: string | undefined;
  onClick: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, spectrumCanvasPosition: number[]) => void;
}

const SpectrumMap: React.FC<Transmission> = (props) => {
  const spectrumCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [spectrumCanvasPosition, setSpectrumCanvasPosition] = useState([0, 0]);

  useEffect(() => {
    // draw spectrum
    const spectrumCanvas = spectrumCanvasRef.current;
    if (spectrumCanvas === null) return;
    const ctx = spectrumCanvas.getContext("2d");

    let whiteGradient = (ctx as CanvasRenderingContext2D).createLinearGradient(0, 0, 100, 0);
    whiteGradient.addColorStop(0, "#FFFFFF");
    whiteGradient.addColorStop(1, `#${props.hue}`);
    (ctx as CanvasRenderingContext2D).fillStyle = whiteGradient;
    (ctx as CanvasRenderingContext2D).fillRect(0, 0, 100, 100);

    let blackGradient = (ctx as CanvasRenderingContext2D).createLinearGradient(0, 100, 0, 0);
    blackGradient.addColorStop(0, "#000000");
    blackGradient.addColorStop(1, "transparent");
    (ctx as CanvasRenderingContext2D).fillStyle = blackGradient;
    (ctx as CanvasRenderingContext2D).fillRect(0, 0, 100, 100);

    const spectrumCanvasLeft = spectrumCanvas.offsetLeft + spectrumCanvas.clientLeft;
    const spectrumCanvasTop = spectrumCanvas.offsetTop + spectrumCanvas.clientTop;
    setSpectrumCanvasPosition([spectrumCanvasLeft, spectrumCanvasTop]);
    console.log("spectrumCanvasLeft", spectrumCanvasLeft, "spectrumCanvasTop", spectrumCanvasTop);
  }, [props.hue]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, spectrumCanvasPosition: number[]) => {
      props.onClick(e, spectrumCanvasPosition);
    },
    []
  );

  return (
    <canvas
      id="spectrum-map"
      width="100"
      height="100"
      ref={spectrumCanvasRef}
      onClick={(e) => handleClick(e, spectrumCanvasPosition)}
    ></canvas>
  );
};

export default SpectrumMap;
