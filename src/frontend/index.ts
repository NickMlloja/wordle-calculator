import { isValidWordleSolution } from "./words";
import {
	getAllSolutionSeries,
	TileState,
	type InputSeries,
	type WordleInput,
	type SolutionSeries,
	guessToInput,
	MAX_SOLUTIONS,
} from "./solver";

const ROWS = 6;
const COLS = 5;

function createTile(): HTMLDivElement {
	const tile = document.createElement("div");
	tile.className = "wordle-tile state-absent";

	let state = TileState.Absent;

	function applyState(): void {
		tile.classList.remove("state-absent", "state-present", "state-correct");

		if (state === TileState.Absent) {
			tile.classList.add("state-absent");
		} else if (state === TileState.Present) {
			tile.classList.add("state-present");
		} else if (state === TileState.Correct) {
			tile.classList.add("state-correct");
		}
	}

	tile.addEventListener("click", () => {
		state = (state + 1) % 3;
		applyState();
		tile.dispatchEvent(new CustomEvent("tilechange", { bubbles: true }));
	});

	return tile;
}

function createGrid(gridElement: HTMLElement): void {
	for (let row = 0; row < ROWS; row += 1) {
		for (let col = 0; col < COLS; col += 1) {
			gridElement.appendChild(createTile());
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
	const tiles = Array.from(gridElement.children).filter(
		(el): el is HTMLDivElement => el instanceof HTMLDivElement
	);

	for (let row = 0; row < ROWS - 1; row += 1) {
		const rowTiles = tiles.slice(row * COLS, (row + 1) * COLS);
		const allGreen = rowTiles.every((tile) =>
			tile.classList.contains("state-correct")
		);

		if (!allGreen) { continue; }

		for (let r = row + 1; r < ROWS; r += 1) {
			const belowTiles = tiles.slice(r * COLS, (r + 1) * COLS);
			if (belowTiles.some((tile) => !tile.classList.contains("state-absent"))) {
				return "Cannot have non-grey tiles below an all-green row.";
			}
		}
	}

	return null;
}

function mapSolutionInput(gridElement: HTMLElement): InputSeries {
	const tiles = Array.from(gridElement.children).filter(
		(el): el is HTMLDivElement => el instanceof HTMLDivElement
	);

	function getTileState(tile: HTMLDivElement | undefined): TileState {
		if (!tile) 										{ return TileState.Absent; }
		if (tile.classList.contains("state-correct")) 	{ return TileState.Correct; }
		if (tile.classList.contains("state-present")) 	{ return TileState.Present; }
		return TileState.Absent;
	}

	function buildRow(rowIndex: number): WordleInput {
		const start = rowIndex * COLS;
		const rowTiles = tiles.slice(start, start + COLS);

		return [
			getTileState(rowTiles[0]),
			getTileState(rowTiles[1]),
			getTileState(rowTiles[2]),
			getTileState(rowTiles[3]),
			getTileState(rowTiles[4]),
		];
	}

	return [
		buildRow(0),
		buildRow(1),
		buildRow(2),
		buildRow(3),
		buildRow(4),
		buildRow(5),
	];
}

async function runCalculator(
	solutionInput: HTMLInputElement,
	solutionError: HTMLElement,
	gridElement: HTMLElement,
	gridError: HTMLElement
): Promise<SolutionSeries[]> {
	const value = solutionInput.value.trim().toLowerCase();

	solutionError.style.display = "none";
	gridError.style.display = "none";
	solutionInput.classList.remove("invalid");

	if (!isFiveLetters(value)) {
		solutionInput.classList.add("invalid");
		solutionError.textContent = "Solution must be 5 letters.";
		solutionError.style.display = "block";
		return [];
	}

	if (!(await isSolutionValid(value))) {
		solutionInput.classList.add("invalid");
		solutionError.textContent = "Solution is not in Wordle's solutions list.";
		solutionError.style.display = "block";
		return [];
	}

	const tileError = checkTileRules(gridElement);
	if (tileError !== null) {
		gridError.textContent = tileError;
		gridError.style.display = "block";
		return [];
	}

	const inputs = mapSolutionInput(gridElement);
	const solutions = await getAllSolutionSeries(value, inputs);

	return Array.from(solutions);
}

document.addEventListener("DOMContentLoaded", () => {
	const gridElement = document.getElementById("wordle-grid");
	if (gridElement === null) {
		throw new Error("Wordle grid container not found");
	}

	const solutionInput = document.getElementById("solution-input");
	if (!(solutionInput instanceof HTMLInputElement)) {
		throw new Error("Solution input not found");
	}

	const solutionError = document.getElementById("solution-error");
	if (solutionError === null) {
		throw new Error("Solution error element not found");
	}

	const gridError = document.getElementById("grid-error");
	if (gridError === null) {
		throw new Error("Grid error element not found");
	}

	initializePage(
		gridElement,
		solutionInput,
		solutionError,
		gridError
	);
});

function initializePage(
	gridElement: HTMLElement,
	solutionInput: HTMLInputElement,
	solutionError: HTMLElement,
	gridError: HTMLElement
): void {
	createGrid(gridElement);

	let solutionArray: SolutionSeries[] = [];
	let solutionIndex = 0;

	const prevBtn = document.getElementById("prev-solution");
	const nextBtn = document.getElementById("next-solution");
	const counter = document.getElementById("solution-counter");

	if (
		!(prevBtn instanceof HTMLButtonElement) ||
		!(nextBtn instanceof HTMLButtonElement) ||
		counter === null
	) {
		throw new Error("Solution controls missing");
	}

	const counterEl = counter;

	function renderSolution(): void {
		const renderRoot = document.getElementById("solution-render");

		if (!(renderRoot instanceof HTMLElement)) {
			throw new Error("Solution render element not found");
		}

		renderRoot.innerHTML = "";

		const solution = solutionArray[solutionIndex];
		if (!solution) {
			return;
		}

		const solutionWord = solution[5];

		for (let i = 0; i < 6; i += 1) {
			const guess = solution[i];

			if (!guess) {
				continue;
			}

			const row = document.createElement("div");
			row.className = "solution-row";

			const pattern = guessToInput(guess, solutionWord);

			for (let j = 0; j < 5; j += 1) {
				const tile = document.createElement("div");
				tile.className = "solution-tile";

				const letter = guess[j];
				tile.textContent = letter === undefined ? "" : letter.toUpperCase();

				const state = pattern[j];

				if (state === TileState.Correct) {
					tile.classList.add("state-correct");
				} else if (state === TileState.Present) {
					tile.classList.add("state-present");
				} else {
					tile.classList.add("state-absent");
				}

				row.appendChild(tile);
			}

			renderRoot.appendChild(row);
		}
	}

	function updateUI(): void {
		const len = solutionArray.length;
		let totalText: string;

		if (len >= MAX_SOLUTIONS) {
			totalText = '1000+'
		} else {
			totalText = String(len);
		}

		counterEl.textContent = String(solutionIndex + 1) + " / " + totalText;

		renderSolution();
	}

	async function recompute(): Promise<void> {
		const results = await runCalculator(
			solutionInput,
			solutionError,
			gridElement,
			gridError
		);

		solutionArray = results;
		solutionIndex = 0;

		updateUI();
	}

	nextBtn.addEventListener("click", () => {
		if (solutionIndex < solutionArray.length - 1) {
			solutionIndex += 1;
			updateUI();
		}
	});

	prevBtn.addEventListener("click", () => {
		if (solutionIndex > 0) {
			solutionIndex -= 1;
			updateUI();
		}
	});

	solutionInput.addEventListener("input", () => {
		solutionInput.classList.remove("invalid");
		solutionError.style.display = "none";
		gridError.style.display = "none";

		void recompute();
	});

	gridElement.addEventListener("tilechange", () => {
		void recompute();
	});

	console.log("Page initialized.");
}
