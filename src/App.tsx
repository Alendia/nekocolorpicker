import React, { useState, useCallback, useEffect } from "react";
import "./App.less";
import HueMap from "./components/hueMap";
import SpectrumMap from "./components/spectrumMap";
import { getHue, getColor, hex2Hue } from "./util/color";

const App: React.FC = () => {
  const [hueCanvasClickPoint, setHueCanvasClickPoint] = useState(0);
  const [spectrumCanvasClickPoint, setSpectrumCanvasClickPoint] = useState([0, 0]);
  const [hue, setHue] = useState("FF0000");

  const onHueMapClick = useCallback((e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, hueCanvasPosition: number) => {
    // get click point position
    const y = e.pageY - hueCanvasPosition;
    console.log("Y:", e.pageY, "position", hueCanvasPosition);
    setHueCanvasClickPoint(y);
    console.log("y", y);
    e.preventDefault();
    // update hue
    const hue = getHue(y);
    setHue(hue);
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

  const handleInputChange = (hex: string) => {
    // validity check
    if (!/^([A-Fa-f0-9]{3}([A-Fa-f0-9]{3})?)$/.test(hex)) return;
    console.log(hex);
    let hexStr = hex;
    if (hex.length === 3) {
      hexStr = hex + hex;
    }
    // update hue
    const tranferredhue = hex2Hue(hexStr);
    setHue(tranferredhue);
  };

  const color = getColor(spectrumCanvasClickPoint[0], spectrumCanvasClickPoint[1], getHue(hueCanvasClickPoint));
  const hueValue = getHue(hueCanvasClickPoint);
  return (
    <div className="app">
      <HueMap onClick={(e, hueCanvasPosition) => onHueMapClick(e, hueCanvasPosition)} />
      <SpectrumMap
        onClick={(e, spectrumCanvasPosition) => onSpectrumMapClick(e, spectrumCanvasPosition)}
        hue={hue}
      />
      <p className="color-info">{`hue: ${hueValue}`}</p>
      <p className="color-info">{`color:${color}`}</p>
      <div className="palette" style={{ backgroundColor: `#${color}` }}></div>
      <div className="color-input">
        <label htmlFor="colorinput">#</label>
        <input id="colorinput" type="text" maxLength={6} onChange={(e) => handleInputChange(e.target.value)}></input>
      </div>
    </div>
  );
};

export default App;
