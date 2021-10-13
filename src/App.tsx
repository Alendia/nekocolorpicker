import React, { useState, useCallback } from "react";
import "./App.less";
import HueMap from "./components/hueMap";
import SpectrumMap from "./components/spectrumMap";

const App: React.FC = () => {
  const [hueCanvasClickPoint, setHueCanvasClickPoint] = useState(0);
  const [spectrumCanvasClickPoint, setSpectrumCanvasClickPoint] = useState([0, 0]);
  const [hue, setHue] = useState("FFFFFF");

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
    console.log("whiteProportion:", whiteProportion);
    console.log("blackProportion:", blackProportion);
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
      e.preventDefault();
    },
    []
  );

  const handleChange = (hex: string) => {
    // validity check
    if (!/^([A-Fa-f0-9]{3}([A-Fa-f0-9]{3})?)$/.test(hex)) return;
    console.log(hex);
    if (hex.length === 3) {
      hex = hex + hex;
    }
    const hue = hex2Hue(hex);
    setHue(hue);
  };

  const hex2Hue = (hex: string) => {
    console.log("======Input change======");
    let [RStr, GStr, BStr] = hex.match(/.{1,2}/gi) ?? [];
    // tranfer to RGB number
    const [ROriginal, GOriginal, BOriginal] = [RStr, GStr, BStr].map((valueStr) => {
      return Number.parseInt(valueStr, 16);
    });
    console.log("RGB", ROriginal, GOriginal, BOriginal);

    const cmax = Math.max(ROriginal, GOriginal, BOriginal);
    const cmin = Math.min(ROriginal, GOriginal, BOriginal);
    const [R, G, B] = [ROriginal, GOriginal, BOriginal].map((k) => {
      let result = Math.round(((k - cmin) / (cmax - cmin)) * 255).toString(16);
      return (result = result.length === 1 ? "0" + result : result);
    });
    console.log(R, G, B);
    console.log("======Input change======");
    return [R, G, B].join("");
  };

  const color = getColor(spectrumCanvasClickPoint[0], spectrumCanvasClickPoint[1], getHue(hueCanvasClickPoint));
  const hueValue = getHue(hueCanvasClickPoint);
  return (
    <div className="app">
      <HueMap onClick={(e, hueCanvasPosition) => onHueMapClick(e, hueCanvasPosition)} />
      <SpectrumMap
        onClick={(e, spectrumCanvasPosition) => onSpectrumMapClick(e, spectrumCanvasPosition)}
        hue={hueValue}
      />
      <p className="color-info">hue:{hueValue}</p>
      <p className="color-info">color:{color}</p>
      <div className="palette" style={{ backgroundColor: `#${color}` }}></div>
      <label>#</label>
      <input type="text" maxLength={6} onChange={(e) => handleChange(e.target.value)}></input>
    </div>
  );
};

export default App;
