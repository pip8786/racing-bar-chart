import React, {useState} from "react";
import RacingBarChart from "./RacingBarChart";
import "./App.css";
import useInterval from "./useInterval";
import Goals from "./datedgoals.json";
import Seasons from "./playerseasons.json";
import Icon, {Icons} from "./Icons";

export type Day = {
	season: string
	gameDay: number
	timestamp: number
	players: Player[] //sorted list of players by goals
}

export type Player = {
	id: number
	name: string
	cumulativeGoals: number
}

export type PlayerSeasons = {
	[playerID: number]: string[]
}

function App() {
	const [iteration, setIteration] = useState(0);
	const [start, setStart] = useState(false);
	const [data] = useState(() => {
		let days: Day[] = [];
		let currentIndex = -1;
		for (let goal of Goals) {
			let timestamp = new Date(goal.date).getTime();
			let day = days[currentIndex];
			if (!day || day.timestamp !== timestamp) {
				let gameDay = 1;
				if (day) {
					day.players.sort((a, b) => b.cumulativeGoals - a.cumulativeGoals);
					gameDay = day.season === goal.season ? day.gameDay + 1 : 1;
				}
				let players = day ? JSON.parse(JSON.stringify(day.players)) : [];

				day = {
					timestamp,
					players,
					season: goal.season,
					gameDay
				};
				days.push(day);
				currentIndex++;
			}
			let player = day.players.find(value => value.id === goal.player_id);
			if (!player) {
				player = {
					id: goal.player_id,
					name: goal.name,
					cumulativeGoals: 1
				};
				day.players.push(player);
			} else {
				player.cumulativeGoals++;
			}
		}
		return days;
	});

	const [seasons] = useState(() => {
		const seasons: PlayerSeasons = {};
		for (let playerSeason of Seasons) {
			let playerArray = seasons[playerSeason.playerID];
			if (!playerArray) {
				playerArray = [];
				seasons[playerSeason.playerID] = playerArray;
			}
			playerArray.push(playerSeason.seasonName);
		}
		return seasons;
	});

	useInterval(() => {
		if (start && iteration < data.length - 1) {
			setIteration(iteration => iteration + 1);
		}
	}, 550);

	return (
		<React.Fragment>
			<h1>Goals Racing Bar Chart</h1>
			<RacingBarChart days={data} iteration={iteration} playerSeasons={seasons}/>
			<p>{data[iteration].season} - Game
				Day {data[iteration].gameDay} - {new Date(data[iteration].timestamp).toLocaleDateString()}</p>
			<div className="buttonContainer">
				<button onClick={() => setIteration(iteration => Math.max(iteration - 10, 0))} title="Back 10">
					<Icon type={Icons.chevronsLeft}/>
				</button>
				<button onClick={() => setIteration(iteration => Math.max(iteration - 1, 0))} title="Previous">
					<Icon type={Icons.chevronLeft}/>
				</button>
				<button onClick={() => setStart(!start)} title={start ? "Pause" : "Play"}>
					<Icon type={start ? Icons.pause : Icons.play}/>
				</button>
				<button onClick={() => setIteration(iteration => Math.min(iteration + 1, data.length-1))} title="Next">
					<Icon type={Icons.chevronRight}/>
				</button>
				<button onClick={() => setIteration(iteration => Math.min(iteration + 10, data.length-1))}
						title="Skip 10">
					<Icon type={Icons.chevronsRight}/>
				</button>
				<button onClick={() => {
					setStart(false);
					setIteration(0);
				}} title="Reset">
					<Icon type={Icons.reset}/>
				</button>
			</div>
		</React.Fragment>
	);
}

export default App;