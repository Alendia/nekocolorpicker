import React, { useState, useCallback } from "react";
import "./App.less";
import HueMap from "./components/hueMap";
import SpectrumMap from "./components/spectrumMap";

const App: React.FC = () => {
  const [hueCanvasClickPoint, setHueCanvasClickPoint] = useState(0);
  const [spectrumCanvasClickPoint, setSpectrumCanvasClickPoint] = useState([0, 0]);

  const getHue = (y: number) => {
    const hueArea = Math.trunc(y / 40);
    const positionInHueArea = y / 40 - Math.trunc(y / 40);
    let positionPositive = Math.floor(positionInHueArea * 256).toString(16);
    let positionNegative = Math.floor((1 - positionInHueArea) * 256).toString(16);
    // add zero
    positionPositive = positionPositive.length === 1 ? "0" + positionPositive : positionPositive;
    positionNegative = positionNegative.length === 1 ? "0" + positionNegative : positionNegative;
    console.log(positionPositive, positionNegative);
    switch (hueArea) {
      case 0:
        return `FF00${positionPositive}`;
      case 1:
        return `${positionNegative}00FF`;
      case 2:
        return `00${positionPositive}FF`;
      case 3:
        return `00FF${positionNegative}`;
      case 4:
        return `${positionPositive}FF00`;
      case 5:
        return `FF${positionNegative}00`;
      default:
        return "FF0000";
    }
  };

  const getColor = (x: number, y: number, hue: string) => {
    const whiteProportion = x / 100;
    const blackProportion = 1 - y / 100;
    console.log("whitePorpotion:", whiteProportion);
    console.log("blackPorpotion:", blackProportion);
    let [RStr, GStr, BStr] = hue.match(/.{1,2}/gi) ?? [];
    console.log(RStr, GStr, BStr);
    const [R, G, B] = [RStr, GStr, BStr].map((valueStr) => {
      let value = Number.parseInt(valueStr, 16);
      value = Math.floor(whiteProportion * value + (1 - whiteProportion) * 255);
      let result = Math.floor(blackProportion * value).toString(16);
      // add zero
      return (result = result.length === 1 ? `0${result}` : result);
    });
    console.log(R, G, B);
    return [R, G, B].join("");
  };

  const onHueMapClick = useCallback((e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, hueCanvasPosition: number) => {
    // get click point position
    const y = e.pageY - hueCanvasPosition;
    console.log("Y:", e.pageY, "position", hueCanvasPosition);
    setHueCanvasClickPoint(y);
    console.log("y", y);
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const onSpectrumMapClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, spectrumCanvasPosition: number[]) => {
      console.log("pageXY", e.pageX, e.pageY);
      console.log("spectrumPosition", spectrumCanvasPosition);
      const x = e.pageX - spectrumCanvasPosition[0];
      const y = e.pageY - spectrumCanvasPosition[1];
      console.log("x", x, "y", y);
      setSpectrumCanvasClickPoint([x, y]);
      e.stopPropagation();
      e.preventDefault();
    },
    []
  );

  const color = getColor(spectrumCanvasClickPoint[0], spectrumCanvasClickPoint[1], getHue(hueCanvasClickPoint));
  return (
    <div className="app">
      <HueMap onClick={(e, hueCanvasPosition) => onHueMapClick(e, hueCanvasPosition)} />
      <SpectrumMap
        onClick={(e, spectrumCanvasPosition) => onSpectrumMapClick(e, spectrumCanvasPosition)}
        hue={getHue(hueCanvasClickPoint)}
      />
      <p className="color-info">{getHue(hueCanvasClickPoint)}</p>
      <p className="color-info">{color}</p>
      <div className="palette" style={{ backgroundColor: `#${color}` }}></div>
    </div>
  );
};

export default App;
