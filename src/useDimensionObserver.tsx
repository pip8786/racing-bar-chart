import {RefObject, useEffect, useState} from "react";
import ResizeObserver from "resize-observer-polyfill";

interface ResizeObserverEntry {
	target: HTMLElement
	contentRect: DOMRectReadOnly
}

export function useDimensionObserver(ref: RefObject<HTMLElement>) {

	const [width, setWidth] = useState<number>();
	const [height, setHeight] = useState<number>();

	useEffect(() => {
		if (!ref || !ref.current) {
			return;
		}

		setWidth(ref.current.clientWidth);
		setHeight(ref.current.clientHeight);

		//@ts-ignore
		let resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
			const entry = entries[0];
			setWidth(entry.contentRect.width);
			setHeight(entry.contentRect.height);
		});

		resizeObserver.observe(ref.current);
		let current = ref.current;
		return function cleanup() {
			if (resizeObserver && current) {
				resizeObserver.unobserve(current);
			}
		};

	}, [ref]);

	return {width, height};
}