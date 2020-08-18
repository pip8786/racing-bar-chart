import React, {useRef, useEffect} from "react";
import {select, scaleBand, scaleLinear, max} from "d3";
import {Horse} from "./App";
import {useDimensionObserver} from "./useDimensionObserver";

type RacingBarChartProps = {
	data: Horse[]
}

function RacingBarChart({data}:RacingBarChartProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const {width,height} = useDimensionObserver(wrapperRef);

	// will be called initially and on every data change
	useEffect(() => {
		const svg = select(svgRef.current);
		if (!width || !height) return;

		// sorting the data
		data.sort((a, b) => b.value - a.value);

		const yScale = scaleBand<number>()
			.paddingInner(0.1)
			.domain(data.map((value, index) => index)) // [0,1,2,3,4,5]
			.range([0, height]); // [0, 200]

		const xScale = scaleLinear()
			.domain([0, max(data, entry => entry.value) ?? 0]) // [0, 65 (example)]
			.range([0, width]); // [0, 400 (example)]

		// draw the bars
		svg
			.selectAll<SVGRectElement,Horse>(".bar")
			.data(data, (entry, index) => entry.name)
			.join(enter =>
				enter.append("rect").attr("y", (entry, index) => yScale(index) ?? 0)
			)
			.attr("fill", entry => entry.color)
			.attr("class", "bar")
			.attr("x", 0)
			.attr("height", yScale.bandwidth())
			.transition().duration(500)
			.attr("width", entry => xScale(entry.value))
			.attr("y", (entry, index) => yScale(index) ?? 0);

		// draw the labels
		svg
			.selectAll<SVGTextElement, Horse>(".label")
			.data(data, (entry, index) => entry.name)
			.join(enter =>
				enter
					.append("text")
					.attr(
						"y",
						(entry, index) => (yScale(index) ?? 0) + yScale.bandwidth() / 2 + 5
					)
			)
			.text(entry => `🐎 ... ${entry.name} (${entry.value} meters)`)
			.attr("class", "label")
			.attr("x", 10)
			.transition().duration(500)
			.attr("y", (entry, index) => (yScale(index) ?? 0) + yScale.bandwidth() / 2 + 5);
	}, [data, width, height]);

	return (
		<div ref={wrapperRef} style={{marginBottom: "2rem"}}>
			<svg ref={svgRef}></svg>
		</div>
	);
}

export default RacingBarChart;