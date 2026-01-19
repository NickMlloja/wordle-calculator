import { isValidWordleSolution } from "./words";

type TileState = 0 | 1 | 2;

const ROWS = 6;
const COLS = 5;

function createTile(): HTMLDivElement {
	const tile = document.createElement("div");
	tile.className = "wordle-tile state-absent";

	let state: TileState = 0;

	function applyState(): void {
		tile.classList.remove("state-absent", "state-present", "state-correct");

		if (state === 0) { tile.classList.add("state-absent"); }
		else if (state === 1) { tile.classList.add("state-present"); }
		else if (state === 2) { tile.classList.add("state-correct"); }
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

function isFiveLetters(word: string): boolean {
	return /^[a-zA-Z]{5}$/.test(word);
}

async function isSolutionValid(word: string): Promise<boolean> {
	return await isValidWordleSolution(word);
}

function checkTileRules(gridElement: HTMLElement): string | null {
	const tiles = Array.from(gridElement.children).filter((el): el is HTMLDivElement => el instanceof HTMLDivElement);

	for (let row = 0; row < ROWS - 1; row += 1) {
		const rowTiles = tiles.slice(row * COLS, (row + 1) * COLS);
		const allGreen = rowTiles.every(tile => tile.classList.contains("state-correct"));

		if (!allGreen) { continue; }

		for (let r = row + 1; r < ROWS; r += 1) {
			const belowTiles = tiles.slice(r * COLS, (r + 1) * COLS);
			if (belowTiles.some(tile => !tile.classList.contains("state-absent"))) {
				return "Cannot have non-grey tiles below an all-green row.";
			}
		}
	}

	return null;
}

async function runCalculator(
	solutionInput: HTMLInputElement,
	solutionError: HTMLElement,
	gridElement: HTMLElement,
	gridError: HTMLElement
): Promise<void> {
	const value = solutionInput.value.trim().toLowerCase();

	solutionError.style.display = "none";
	gridError.style.display = "none";
	solutionInput.classList.remove("invalid");

	if (!isFiveLetters(value)) {
		solutionInput.classList.add("invalid");
		solutionError.textContent = "Solution must be 5 letters.";
		solutionError.style.display = "block";
		return;
	}

	if (!(await isSolutionValid(value))) {
		solutionInput.classList.add("invalid");
		solutionError.textContent = "Solution is not in Wordle's solutions list.";
		solutionError.style.display = "block";
		return;
	}

	const tileError = checkTileRules(gridElement);
	if (tileError !== null) {
		gridError.textContent = tileError;
		gridError.style.display = "block";
		return;
	}

	console.log(`Valid Solution Submitted: ${value}`);
}

document.addEventListener("DOMContentLoaded", () => {
	const gridElement = document.getElementById("wordle-grid");
	if (gridElement === null) { throw new Error("Wordle grid container not found"); }

	const runButton = document.getElementById("run-calculator-button");
	if (runButton === null) { throw new Error("Run Calculator button not found"); }

	const solutionInput = document.getElementById("solution-input");
	if (!(solutionInput instanceof HTMLInputElement)) { throw new Error("Solution input not found"); }

	const solutionError = document.getElementById("solution-error");
	if (solutionError === null) { throw new Error("Solution error element not found"); }

	const gridError = document.getElementById("grid-error");
	if (gridError === null) { throw new Error("Grid error element not found"); }

	createGrid(gridElement);

	runButton.addEventListener("click", () => {
		void runCalculator(solutionInput, solutionError, gridElement, gridError);
	});

	solutionInput.addEventListener("input", () => {
		solutionInput.classList.remove("invalid");
		solutionError.style.display = "none";
		gridError.style.display = "none";
	});

	console.log("Page initialized.");
});
