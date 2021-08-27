
import React from "react";
import PropTypes from "prop-types"; //I should start checking prop types

export default function Chart({data,height,width,horizontalGuides, verticalGuides}){
    const FONT_SIZE = width / 30; //arbitrary numbers
    const maximumXFromData = Math.max(...data.map(e => e.x));
    const maximumYFromData = Math.max(...data.map(e => e.y));

    const padding = (FONT_SIZE) * 3;        //refer to diagram for formulas
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

    //How do we draw lines? https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline
const points = data
    .map(element => {
      const x = (element.x / maximumXFromData) * chartWidth + padding;
      const y =
        chartHeight - (element.y / maximumYFromData) * chartHeight + padding;
      return `${x},${y}`;
    })
    .join(" ");
}

