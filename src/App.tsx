import React, { useState, useCallback, useEffect } from "react";
import "./App.less";
import HueMap from "./components/hueMap";
import SpectrumMap from "./components/spectrumMap";
import ColorInput from "./components/colorInput";
import { getHue, getColor, hex2Hue } from "./util/color";

const App: React.FC = () => {
  const [hueCanvasClickPoint, setHueCanvasClickPoint] = useState(0);
  const [spectrumCanvasClickPoint, setSpectrumCanvasClickPoint] = useState([0, 0]);
  const [hue, setHue] = useState("FF0000");
  const [color, setColor] = useState("transparent");

  const onHueMapClick = useCallback((e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, hueCanvasPosition: number) => {
    // get click point position
    const y = e.pageY - hueCanvasPosition;
    console.log("Y:", e.pageY, "position", hueCanvasPosition);
    setHueCanvasClickPoint(y);
    console.log("y", y);
    e.preventDefault();
    // update hue
    const hueStr = getHue(y);
    setHue(hueStr);
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

  const handleInputChange = (transferredHue: string, hexStr: string) => {
    setHue(transferredHue);
    if (transferredHue) {
      setColor(hexStr);
    }
  };

  useEffect(() => {
    const colorStr = getColor(spectrumCanvasClickPoint[0], spectrumCanvasClickPoint[1], hue);
    console.log(colorStr);
    setColor(colorStr);
  }, [spectrumCanvasClickPoint]);

  return (
    <div className="app">
      <HueMap onClick={(e, hueCanvasPosition) => onHueMapClick(e, hueCanvasPosition)} />
      <SpectrumMap hue={hue} onClick={(e, spectrumCanvasPosition) => onSpectrumMapClick(e, spectrumCanvasPosition)} />
      <p className="color-info">{`hue: ${hue}`}</p>
      <p className="color-info">{`color:${color}`}</p>
      <div className="palette" style={{ backgroundColor: `#${color}` }}></div>
      <ColorInput onChange={(transferredHue, hexStr) => handleInputChange(transferredHue, hexStr)} />
    </div>
  );
};

export default App;
