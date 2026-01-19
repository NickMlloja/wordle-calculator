type TileState = 0 | 1 | 2;

const ROWS = 6;
const COLS = 5;

function createTile(): HTMLDivElement {
	const tile = document.createElement("div");
	tile.className = "wordle-tile state-absent";

	let state: TileState = 0;

	function applyState(): void {
		tile.classList.remove("state-absent", "state-present", "state-correct");

		if (state === 0) {
			tile.classList.add("state-absent");
			return;
		}

		if (state === 1) {
			tile.classList.add("state-present");
			return;
		}

		if (state === 2) {
			tile.classList.add("state-correct");
			return;
		}
	}

	tile.addEventListener("click", () => {
		state = (state + 1) % 3;
		applyState();
	});

	return tile;
}

function createGrid(gridElement: HTMLElement): void {
	for (let row = 0; row < ROWS; row += 1) {
		for (let col = 0; col < COLS; col += 1) {
			const tile = createTile();
			gridElement.appendChild(tile);
		}
	}
}

function isValidSolution(value: string): boolean {
	return /^[a-zA-Z]{5}$/.test(value);
}

function runCalculator(solutionInput: HTMLInputElement, errorElement: HTMLElement): void {
	const value = solutionInput.value.trim();

	if (!isValidSolution(value)) {
		solutionInput.classList.add("invalid");
		errorElement.style.display = "block";
		return;
	}

	errorElement.style.display = "none";
	console.log("Valid solution:", value.toUpperCase());
}

document.addEventListener("DOMContentLoaded", () => {
	const gridElement = document.getElementById("wordle-grid");
	if (!(gridElement instanceof HTMLElement)) { throw new Error("Wordle grid container not found"); }

	const runButton = document.getElementById("run-calculator-button");
	if (!(runButton instanceof HTMLElement)) { throw new Error("Run Calculator button not found"); }

	const solutionInput = document.getElementById("solution-input");
	if (!(solutionInput instanceof HTMLInputElement)) { throw new Error("Solution input not found"); }

	const solutionError = document.getElementById("solution-error");
	if (!(solutionError instanceof HTMLElement)) { throw new Error("Solution error element not found"); }

	createGrid(gridElement);

	runButton.addEventListener("click", () => {
		runCalculator(solutionInput, solutionError);
	});

	solutionInput.addEventListener("input", () => {
		solutionInput.classList.remove("invalid");
		solutionError.style.display = "none";
	});

	console.log("Page initialized.");
});
