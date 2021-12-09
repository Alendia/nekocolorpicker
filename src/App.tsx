import React, { useState, useCallback, useEffect } from "react";
import "./App.less";
import HueMap from "./components/hueMap";
import SpectrumMap from "./components/spectrumMap";
import { HexColorInput, RGBColorInput } from "./components/colorInput";
import { getHue, getColor } from "./util/color";

const App: React.FC = () => {
  const [hueCanvasClickPoint, setHueCanvasClickPoint] = useState(0);
  const [spectrumCanvasClickPoint, setSpectrumCanvasClickPoint] = useState([0, 0]);
  const [hue, setHue] = useState("FF0000");
  const [color, setColor] = useState("transparent");
  const [exchangeRGBColor, setExchangeRGBColor] = useState("transparent");
  const [exchangeHexColor, setExchangeHexColor] = useState("transparent");

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

  const handleInputChange = (transferredHue: string, hexStr: string, inputType: "RGB" | "Hex") => {
    if (inputType === "RGB") {
      setExchangeHexColor(hexStr);
    } else if (inputType === "Hex") {
      setExchangeRGBColor(hexStr);
    }
    setHue(transferredHue);
    setColor(hexStr);
  };

  useEffect(() => {
    const colorStr = getColor(spectrumCanvasClickPoint[0], spectrumCanvasClickPoint[1], hue);
    console.log(colorStr);
    setColor(colorStr);
    // click changes input value
    setExchangeHexColor(colorStr);
    setExchangeRGBColor(colorStr);
  }, [spectrumCanvasClickPoint]);

  return (
    <div className="app">
      <div className="map">
        <HueMap onClick={(e, hueCanvasPosition) => onHueMapClick(e, hueCanvasPosition)} />
        <SpectrumMap hue={hue} onClick={(e, spectrumCanvasPosition) => onSpectrumMapClick(e, spectrumCanvasPosition)} />
        <HexColorInput
          exchangeColor={exchangeHexColor}
          onChange={(transferredHue, transferredHex) => handleInputChange(transferredHue, transferredHex, "Hex")}
        />
        <RGBColorInput
          exchangeColor={exchangeRGBColor}
          onChange={(transferredHue, transferredHex) => handleInputChange(transferredHue, transferredHex, "RGB")}
        />
      </div>
      <div className="palette" style={{ backgroundColor: `#${color}` }}></div>
      <p className="color-info">{`hue: ${hue}`}</p>
      <p className="color-info">{`color:${color}`}</p>
    </div>
  );
};

export default App;
