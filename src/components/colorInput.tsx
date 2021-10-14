import React, { useCallback, useState } from "react";
import { hex2Hue } from "../util/color";

interface Transmission {
  onChange: (transferredHue: string, hexStr: string) => void;
}

const ColorInput: React.FC<Transmission> = (props) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = useCallback((hex: string) => {
    // tranform this input element into a controlled component
    setInputValue(hex);
    // validity check
    if (!/^([A-Fa-f0-9]{3}([A-Fa-f0-9]{3})?)$/.test(hex)) return;
    console.log(hex);
    let hexStr = hex;
    if (hex.length === 3) {
      hexStr = hex.replace(/(.)/g, "$1$1");
    }
    // update hue
    const transferredhue = hex2Hue(hexStr);
    props.onChange(transferredhue, hexStr);
  }, []);

  return (
    <div className="color-input">
      <label htmlFor="colorinput">#</label>
      <input
        id="colorinput"
        type="text"
        maxLength={6}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
      ></input>
    </div>
  );
};

export default ColorInput;
