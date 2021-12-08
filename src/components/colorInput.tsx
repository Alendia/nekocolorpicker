import React, { useCallback, useEffect, useState } from "react";
import { hex2Hue, RGB2hex } from "../util/color";

interface HexInputProps {
  onChange: (transferredHue: string, transferredHex: string) => void;
}

interface RGBInputProps {
  onChange: (transferredHue: string, transferredHex: string) => void;
}

const HexColorInput: React.FC<HexInputProps> = (props) => {
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
    const transferredHue = hex2Hue(hexStr);
    props.onChange(transferredHue, hexStr);
  }, []);

  return (
    <div className="color-input">
      <label htmlFor="colorinput">HEX</label>
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

const RGBColorInput: React.FC<RGBInputProps> = (props) => {
  const [R, setR] = useState("255");
  const [G, setG] = useState("0");
  const [B, setB] = useState("0");

  // const handleInputChange = useCallback(() => {
  //   console.log(R, G, B);
  //   if (/^[0-9]$/.test(R) || /^[0-9]$/.test(G) || /^[0-9]$/.test(B)) return;
  //   const transferredHex = RGB2hex([R, G, B]);
  //   const transferredHue = hex2Hue(transferredHex);
  //   props.onChange(transferredHue, transferredHex);
  // }, []);

  const handleInputTypingChange = useCallback((singleColor: string, colorName: "R" | "G" | "B") => {
    const setColor = (colorValue: string, colorName: "R" | "G" | "B") => {
      switch (colorName) {
        case "R":
          setR(colorValue);
          break;
        case "G":
          setG(colorValue);
          break;
        case "B":
          setB(colorValue);
          break;
      }
    };

    const colorNum = parseInt(singleColor, 10);
    // check validility
    if (Number.isNaN(colorNum) || colorNum <= 0) {
      setColor("0", colorName);
    } else if (colorNum > 255) {
      setColor("255", colorName);
    } else {
      setColor(singleColor, colorName);
    }
  }, []);

  useEffect(() => {
    console.log("neko");
    console.log(R, G, B);
    handleInputTypingChange(R, "R");
    handleInputTypingChange(G, "G");
    handleInputTypingChange(B, "B");
    const transferredHex = RGB2hex([R, G, B]);
    console.log("toHex", transferredHex);
    const transferredHue = hex2Hue(transferredHex);
    props.onChange(transferredHue, transferredHex);
  }, [R, G, B]);

  return (
    <div className="color-input">
      <label htmlFor="colorinput">R</label>
      <input
        id="colorinput"
        type="text"
        maxLength={4}
        value={R}
        onChange={(e) => handleInputTypingChange(e.target.value, "R")}
      ></input>
      <label htmlFor="colorinput">G</label>
      <input
        id="colorinput"
        type="text"
        maxLength={4}
        value={G}
        onChange={(e) => handleInputTypingChange(e.target.value, "G")}
      ></input>
      <label htmlFor="colorinput">B</label>
      <input
        id="colorinput"
        type="text"
        maxLength={4}
        value={B}
        onChange={(e) => handleInputTypingChange(e.target.value, "B")}
      ></input>
    </div>
  );
};

export { HexColorInput, RGBColorInput };
