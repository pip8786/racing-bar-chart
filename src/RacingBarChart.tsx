import React, {useRef, useEffect} from "react";
import {select, scaleBand, scaleLinear, max} from "d3";
import {Day, Player, PlayerSeasons} from "./App";
import {useDimensionObserver} from "./useDimensionObserver";

type RacingBarChartProps = {
	days: Day[]
	iteration: number
	playerSeasons: PlayerSeasons
}

function stringToColor(str:string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = "#";
	let parts = [];
	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xFF;
		parts.push(value/255);
		color += ("00" + value.toString(16)).substr(-2);
	}
	let c = parts.map(col => {
		if(col < 0.03928) {
			return col / 12.92;
		}
		return Math.pow((col + 0.055) / 1.055, 2.4);
	});
	let l = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
	return {
		color,
		dark: l < 0.179
	};
}

function RacingBarChart({days, iteration, playerSeasons}: RacingBarChartProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const {width, height} = useDimensionObserver(wrapperRef);

	// will be called initially and on every data change
	useEffect(() => {
		const svg = select(svgRef.current);
		if (!width || !height) return;

		const currentSeason = days[iteration].season;
		const playersToShow = 20;
		const data = days[iteration].players.slice(0,playersToShow);
		const domain = [];
		for(let i = 0; i < 20; i++) {
			domain.push(i);
		}

		const yScale = scaleBand<number>()
			.paddingInner(0.1)
			.domain(domain)
			.range([0, height]);

		const xScale = scaleLinear()
			.domain([0, max(data, entry => entry.cumulativeGoals) ?? 0])
			.range([0, width]);

		// draw the bars
		svg
			.selectAll<SVGRectElement, Player>(".bar")
			.data(data, (entry, index) => entry.name)
			.join(enter =>
				enter.append("rect").attr("y", (entry, index) => yScale(index) ?? 0)
			)
			.attr("fill", entry => playerSeasons[entry.id].includes(currentSeason) ? stringToColor(entry.name).color : "gray")
			.attr("class", "bar")
			.attr("x", 0)
			.attr("height", yScale.bandwidth())
			.transition().duration(325)
			.attr("width", entry => xScale(entry.cumulativeGoals))
			.attr("y", (entry, index) => yScale(index) ?? 0);

		// draw the labels
		svg
			.selectAll<SVGTextElement, Player>(".label")
			.data(data, (entry, index) => entry.name)
			.join(enter =>
				enter
					.append("text")
					.attr(
						"y",
						(entry, index) => (yScale(index) ?? 0) + yScale.bandwidth() / 2 + 5
					)
			)
			.text(entry => `⚽   ${entry.name} (${entry.cumulativeGoals} goals)`)
			.style("white-space", "pre")
			.attr("class", "label")
			.attr("fill", entry => playerSeasons[entry.id].includes(currentSeason) ? stringToColor(entry.name).dark ? "white" : "black" : "lightgray")
			.style("font-weight", "600")
			.attr("x", 10)
			.transition().duration(325)
			.attr("y", (entry, index) => (yScale(index) ?? 0) + yScale.bandwidth() / 2 + 5);
	}, [iteration, days, width, height, playerSeasons]);

	return (
		<div ref={wrapperRef} style={{marginBottom: "2rem"}}>
			<svg ref={svgRef} className="chart"/>
		</div>
	);
}

export default RacingBarChart;