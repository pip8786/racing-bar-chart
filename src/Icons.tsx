import React from "react";

export enum Icons {
	chevronRight,
	chevronsRight,
	chevronLeft,
	chevronsLeft,
	play,
	pause,
	reset
}

type IconProps = {
	type:Icons
}

function Icon({type}:IconProps) {
	let content;
	switch(type) {
		case Icons.chevronRight:
			content = <>
				<path stroke="none" d="M0 0h24v24H0z"/>
				<polyline points="9 6 15 12 9 18"/>
				</>;
			break;
		case Icons.chevronsRight:
			content = <>
				<path stroke="none" d="M0 0h24v24H0z"/>
				<polyline points="7 7 12 12 7 17"/>
				<polyline points="13 7 18 12 13 17"/>
				</>;
			break;
		case Icons.chevronLeft:
			content = <>
					<path stroke="none" d="M0 0h24v24H0z"/>
					<polyline points="15 6 9 12 15 18"/>
				</>;
			break;
		case Icons.chevronsLeft:
			content = <>
				<path stroke="none" d="M0 0h24v24H0z"/>
				<polyline points="11 7 6 12 11 17"/>
				<polyline points="17 7 12 12 17 17"/>
			</>;
			break;
		case Icons.play:
			content = <>
				<path stroke="none" d="M0 0h24v24H0z"/>
				<path d="M18 15l-6-6l-6 6h12" transform="rotate(90 12 12)"/>
			</>;
			break;
		case Icons.pause:
			content = <>
				<path stroke="none" d="M0 0h24v24H0z"/>
				<line x1="10" y1="5" x2="10" y2="19"/>
				<line x1="14" y1="5" x2="14" y2="19"/>
			</>;
			break;
		case Icons.reset:
			content = <>
				<path stroke="none" d="M0 0h24v24H0z"/>
				<path d="M15 4.55a8 8 0 0 0 -6 14.9m0 -4.45v5h-5"/>
				<path d="M13 19.95a8 8 0 0 0 5.3 -12.8" strokeDasharray=".001 4.13"/>
			</>;
			break;
	}
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-right" width="44"
			 height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
			 strokeLinejoin="round">
			{content}
		</svg>
	);
}

export default Icon;