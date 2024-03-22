import React, { useState } from "react";
import { Stack, Slider } from "@mui/material";

export default function TextSlider() {
  const [textSize, setTextSize] = useState(50);
  const handleTextSlide = (e, newValue) => {
    console.log(newValue);
    setTextSize(newValue);
  };

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
      <Slider
        sx={{ width: "10em", color: "white" }}
        aria-label="text-size"
        value={textSize}
        onChange={handleTextSlide}
      />
    </Stack>
  );
}
