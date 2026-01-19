const ROWS: number = 6;
const COLS: number = 5;

const gridElement: HTMLElement | null =
	document.getElementById("wordle-grid");

if (gridElement === null) {
	throw new Error("Wordle grid container not found");
}

const createTile = (): HTMLDivElement => {
	const tile: HTMLDivElement = document.createElement("div");
	tile.className = "wordle-tile";
	return tile;
};

const createGrid = (): void => {
	for (let row: number = 0; row < ROWS; row += 1) {
		for (let col: number = 0; col < COLS; col += 1) {
			const tile: HTMLDivElement = createTile();

			// Example
			if (row === 0) {
				const exampleLetters: readonly string[] = [
					"C",
					"R",
					"A",
					"N",
					"E"
				];

				const letter: string | undefined = exampleLetters[col];
				if (letter !== undefined) {
					tile.textContent = letter;
				}
			}

			gridElement.appendChild(tile);
		}
	}
};

document.addEventListener('DOMContentLoaded', (): void => {
	void (async (): Promise<void> => {
		createGrid();
		console.log('Page initialized.');
	})();
});
