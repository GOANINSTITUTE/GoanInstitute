import React, { useRef, useEffect, useState } from "react";
import "./CSS/CustomEditor.css";

const FONT_SIZES = [
  { label: "Small", value: "2" },
  { label: "Normal", value: "3" },
  { label: "Large", value: "5" },
  { label: "Huge", value: "7" },
];

const FONT_COLORS = [
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#ff0000" },
  { label: "Green", value: "#008000" },
  { label: "Blue", value: "#0000ff" },
  { label: "Orange", value: "#ff6600" },
  { label: "Purple", value: "#800080" },
];

const CustomEditor = ({ value, setValue }) => {
  const editorRef = useRef(null);
  const [fontSize, setFontSize] = useState("3"); // default size
  const [fontColor, setFontColor] = useState("#000000"); // default black

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      setValue(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    try {
      document.execCommand(command, false, value);
      if (editorRef.current) {
        setValue(editorRef.current.innerHTML);
      }
    } catch (err) {
      console.error("Editor command failed:", err);
    }
  };

  const handleFontSizeChange = (e) => {
    const sizeValue = e.target.value;
    setFontSize(sizeValue);
    execCommand("fontSize", sizeValue);
  };

  const handleFontColorChange = (e) => {
    const colorValue = e.target.value;
    setFontColor(colorValue);
    execCommand("foreColor", colorValue);
  };

  const handleAlign = (direction) => {
    execCommand("justify" + direction);
  };

  // Prevent buttons from stealing focus
  const preventFocusLoss = (e) => e.preventDefault();

  return (
    <div className="editor-container ">
      <label className="form-label">Detailed Paragraph</label>

      <div className="toolbar">
        <button
          onMouseDown={preventFocusLoss}
          onClick={() => execCommand("bold")}
          type="button"
          aria-label="Bold"
        >
          <b>B</b>
        </button>
        <button
          onMouseDown={preventFocusLoss}
          onClick={() => execCommand("italic")}
          type="button"
          aria-label="Italic"
        >
          <i>I</i>
        </button>
        <button
          onMouseDown={preventFocusLoss}
          onClick={() => execCommand("underline")}
          type="button"
          aria-label="Underline"
        >
          <u>U</u>
        </button>

        <label
          htmlFor="fontSizeSelect"
          style={{ marginLeft: 10, marginRight: 4, userSelect: "none" }}
        >
          Font Size:
        </label>
        <select
          id="fontSizeSelect"
          value={fontSize}
          onChange={handleFontSizeChange}
        >
          {FONT_SIZES.map((fs) => (
            <option key={fs.value} value={fs.value}>
              {fs.label}
            </option>
          ))}
        </select>

        <label
          htmlFor="fontColorSelect"
          style={{ marginLeft: 10, marginRight: 4, userSelect: "none" }}
        >
          Font Color:
        </label>
        <select
          id="fontColorSelect"
          value={fontColor}
          onChange={handleFontColorChange}
        >
          {FONT_COLORS.map((fc) => (
            <option key={fc.value} value={fc.value}>
              {fc.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          aria-label="Align Left"
          onClick={() => handleAlign("Left")}
        >
          <i className="bi bi-text-left"></i>
        </button>
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          aria-label="Align Center"
          onClick={() => handleAlign("Center")}
        >
          <i className="bi bi-text-center"></i>
        </button>
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          aria-label="Align Right"
          onClick={() => handleAlign("Right")}
        >
          <i className="bi bi-text-right"></i>
        </button>
      </div>

      <div
        className="custom-editor textarea-secondary "
        contentEditable
        dir="ltr"
        ref={editorRef}
        onInput={handleInput}
        suppressContentEditableWarning={true}
        data-placeholder="Write detailed info here..."
      />
    </div>
  );
};

export default CustomEditor;
