/**
 * Get hue string from clicking point on the hueCanvas.
 * @param {number} distance from canvas top to click point - clicking point in hueCanvas
 * @returns {string} hue string (6 digits)
 */

const getHue = (y: number) => {
  const hueArea = Math.trunc(y / 40);
  const positionInHueArea = y / 40 - Math.trunc(y / 40);
  let positionPositive = Math.floor(positionInHueArea * 255).toString(16);
  let positionNegative = Math.floor((1 - positionInHueArea) * 255).toString(16);
  // add zero
  positionPositive = positionPositive.length === 1 ? `0${positionPositive}` : positionPositive;
  positionNegative = positionNegative.length === 1 ? `0${positionNegative}` : positionNegative;
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

/**
 * Get hex color string from clicking point on the spectrumCanvas.
 * @param {number} distance from canvas left to click point - clicking point in spectrumCanvas
 * @param {number} distance from canvas top to click point - clicking point in spectrumCanvas
 * @returns {string} hex string (6 digits)
 */

const getColor = (x: number, y: number, hue: string) => {
  const whiteProportion = x / 200;
  const blackProportion = 1 - y / 200;
  console.log("whiteProportion:", whiteProportion);
  console.log("blackProportion:", blackProportion);
  const [RStr, GStr, BStr] = hue.match(/.{1,2}/gi) ?? [];
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

/**
 * Get hue color string from input hex string
 * @param {string} hex color from input
 * @returns {string} hue string (6 digits)
 */

const hex2Hue = (hex: string) => {
  console.log("======Input change======");
  const [RStr, GStr, BStr] = hex.match(/.{1,2}/gi) ?? [];
  // tranfer to RGB number
  const [ROriginal, GOriginal, BOriginal] = [RStr, GStr, BStr].map((valueStr) => Number.parseInt(valueStr, 16));
  console.log("RGB", ROriginal, GOriginal, BOriginal);

  const cmax = Math.max(ROriginal, GOriginal, BOriginal);
  const cmin = Math.min(ROriginal, GOriginal, BOriginal);
  if (cmax === cmin) {
    return "ff0000";
  }
  const [R, G, B] = [ROriginal, GOriginal, BOriginal].map((k) => {
    const resultNum = Math.round(((k - cmin) / (cmax - cmin)) * 255);
    let result = resultNum.toString(16);
    return (result = result.length === 1 ? `0${result}` : result);
  });
  console.log(R, G, B);
  console.log("======Input change======");
  return [R, G, B].join("");
};

/**
 * Get hex color string from input RGB string array
 * @param {string[]} RGB string array from input
 * @returns {string} hex string (6 digits)
 */

const RGB2hex = (RGB: string[]) => {
  console.log("======Input Start======");
  const [R, G, B] = RGB.map((value) => {
    const valueNum = Number(value).toString(16);
    return `${valueNum}`.length === 1 ? `0${valueNum}` : valueNum;
  });
  console.log(R, G, B);
  console.log("======Input End======");
  return [R, G, B].join("");
};

/**
 * Get RGB string array from hex input's change or click change to hex string
 * @param {string} hex string from click or input
 * @returns {string[]} RGB string array
 */

const hex2RGB = (hex: string) => {
  const [RStr, GStr, BStr] = hex.match(/.{1,2}/gi) ?? [];
  return [RStr, GStr, BStr].map((value) => `${parseInt(value, 16)}`);
};

export { getHue, getColor, hex2Hue, RGB2hex, hex2RGB };
