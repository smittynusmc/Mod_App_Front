import React, { useEffect, useRef, useState } from "react";
import SpinWheel from "./SpinWheel";

const Wheel = ({ mustStartSpinning, prizeNumber, data, onStopSpinning }) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      new SpinWheel("spinCanvas", data, (winner) => {
        setIsSpinning(false);
        onStopSpinning(winner);
      });

      return () => {
        // Clean up if necessary
      };
    }
  }, [canvasRef, data, onStopSpinning]);

  const handleSpinClick = () => {
    if (!isSpinning && mustStartSpinning) {
      setIsSpinning(true);
      document.getElementById("spinCanvas").click();
    }
  };

  useEffect(() => {
    handleSpinClick();
  }, [mustStartSpinning]);

  return (
    <div id="wheel">
      <canvas ref={canvasRef} id="spinCanvas" width="600" height="600" />
      <button onClick={handleSpinClick} disabled={isSpinning}>
        Spin
      </button>
    </div>
  );
};

export default Wheel;
