import { createContext, useContext, useState, useRef } from "react";

const context = createContext();

export function OptionsProvider({ children }) {
  const rem = 16;
  const [showOption, setShow] = useState(false);
  const x = useRef(null);
  const y = useRef(null);
  const height = useRef(null);
  const menu = useRef(null);
  const heightCalculation = useRef({
    marginSize: 1,
    fontSize: 1,
    numberOfOptions: 10,
  });
  const [output, setOut] = useState("");

  const [selected, setSelected] = useState("");

  function setMarginSize(size) {
    heightCalculation.current.marginSize = size;
  }
  function setFontSize(size) {
    heightCalculation.current.fontSize = size;
  }
  function setNumberOfOptions(options) {
    heightCalculation.current.numberOfOptions = options;
  }
  function getMarginSize() {
    return heightCalculation.current.marginSize;
  }
  function getFontSize() {
    return heightCalculation.current.fontSize;
  }
  function getNumberOfOptions() {
    return heightCalculation.current.numberOfOptions;
  }
  function setShowOption(bool) {
    if (bool === true && showOption === true) {

      setShow(1);
    } else if (bool === true && showOption === 1) {

      setShow(true);
    } else {

      setShow(bool);
    }
  }
  function setX(x_value) {
    x.current = x_value;
  }
  function setY(y_value) {
    y.current = y_value;
  }
  function setHeight(height_val) {
    height.current = height_val;
  }
  function setMenuOptions(menuList) {
    menu.current = menuList;
  }
  function getX(x_value) {
    return x.current;
  }
  function getY(y_value) {
    return y.current;
  }
  function getHeight(height_val) {
    return height.current;
  }
  function getMenuOptions(menuList) {
    return menu.current;
  }
  function getCalculatedHeight() {
    return (
      heightCalculation.current.marginSize *
        rem *
        (heightCalculation.current.numberOfOptions + 1) +
      heightCalculation.current.fontSize *
        rem *
        heightCalculation.current.numberOfOptions
    );
  }
  function setSelectedOption(option) {
    setSelected(option);
  }
  function setOutput(output) {
    setOut(output);
    setShow(false);
  }
  const values = {
    getOutput: output,
    getShow: showOption,
    getX,
    getY,
    getHeight,
    getMenuOptions,
    getSelected: selected,
    getCalculatedHeight,
    getMarginSize,
    getNumberOfOptions,
    getFontSize,
    setNumberOfOptions,
    setMarginSize,
    setFontSize,
    setShow: setShowOption,
    setX,
    setY,
    setHeight,
    setMenuOptions,
    setSelectedOption,
    setOutput,
  };
  return <context.Provider value={values}>{children}</context.Provider>;
}
export function useOption() {
  return useContext(context);
}
