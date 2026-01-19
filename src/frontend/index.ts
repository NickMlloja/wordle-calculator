

type TileState = 0 | 1 | 2;

const ROWS: number = 6;
const COLS: number = 5;

const gridElement: HTMLElement | null =
	document.getElementById("wordle-grid");

if (gridElement === null) {
	throw new Error("Wordle grid container not found");
}

const createTile = (): HTMLDivElement => {
	const tile: HTMLDivElement = document.createElement("div");
	tile.className = "wordle-tile state-absent";

	let state: TileState = 0;

	const applyState = (): void => {
		tile.classList.remove(
			"state-absent",
			"state-present",
			"state-correct"
		);

		switch (state) {
			case 0:
				tile.classList.add("state-absent");
				break;
			case 1:
				tile.classList.add("state-present");
				break;
			case 2:
				tile.classList.add("state-correct");
				break;
			default: {
				const _exhaustive: never = state;
				return _exhaustive;
			}
		}
	};

	tile.addEventListener("click", (): void => {
		state = ((state + 1) % 3);
		applyState();
	});

	return tile;
};

const createGrid = (): void => {
	for (let row: number = 0; row < ROWS; row += 1) {
		for (let col: number = 0; col < COLS; col += 1) {
			const tile: HTMLDivElement = createTile();
			gridElement.appendChild(tile);
		}
	}
};

const runCalculator = (): void => {
	console.log("Run Calculator clicked.");
};

document.addEventListener("DOMContentLoaded", (): void => {
	void (async (): Promise<void> => {
		createGrid();

		const runButton: HTMLElement | null = document.getElementById("run-calculator-button");

		if (runButton === null) {
			throw new Error("Run Calculator button not found.");
		}

		runButton.addEventListener("click", (): void => {
			runCalculator();
		});

		console.log("Page initialized.");
	})();
});
