import { loadSolutionsCsv } from "./words";

// Limit Cartesian Product Explosion
const MAX_SOLUTIONS = 1000;

export enum TileState {
    Absent  = 0,
    Present = 1,
    Correct = 2,
}

export type WordleInput = [TileState, TileState, TileState, TileState, TileState];
export type InputSeries = [WordleInput, WordleInput, WordleInput, WordleInput, WordleInput, WordleInput];
type SolutionSeries     = [string, string, string, string, string, string];

function isRowAllGrey(pattern: WordleInput): boolean {
    return pattern.every((s) => { return s === TileState.Absent; });
}

function isRowAllCorrect(pattern: WordleInput): boolean {
    return pattern.every((s) => { return s === TileState.Correct; });
}

// Convert an input word and solution word into the 
function guessToInput(guess: string, solution: string): WordleInput {
    if (guess.length !== 5 || solution.length !== 5) {
        throw new Error("Expected 5 letter words");
    }

    const result: WordleInput = [
        TileState.Absent, TileState.Absent, TileState.Absent, TileState.Absent, TileState.Absent
    ];

    const solutionChars = solution.split("");
    const guessChars    = guess.split("");
    const solutionUsed  = [false, false, false, false, false];
    const guessUsed     = [false, false, false, false, false];

    // Mark correct positions
    for (let i = 0; i < 5; i += 1) {
        if (guessChars[i] === solutionChars[i]) {
            result[i]       = TileState.Correct;
            solutionUsed[i] = true;
            guessUsed[i]    = true;
        }
    }

    // Mark misplaced letters
    for (let i = 0; i < 5; i += 1) {
        if (guessUsed[i]) { continue; }
        for (let j = 0; j < 5; j += 1) {
            if (!solutionUsed[j] && guessChars[i] === solutionChars[j]) {
                result[i]       = TileState.Present;
                solutionUsed[j] = true;
                break;
            }
        }
    }

    return result;
}

function patternsMatch(a: WordleInput, b: WordleInput): boolean {
    for (let i = 0; i < 5; i += 1) {
        if (a[i] !== b[i]) { return false; }
    }
    return true;
}

// Filters the dictionary for words that satisfy a single row's TileStates
function findMatchingWords(
    dictionary: string[], 
    solution: string, 
    targetPattern: WordleInput
): string[] {
    const matches: string[] = [];
    for (const word of dictionary) {
        const pattern = guessToInput(word, solution);
        if (patternsMatch(pattern, targetPattern)) {
            matches.push(word);
        }
    }
    return matches;
}

// Builds a list for each row populated with all valid words for that row
function buildPossibleWordsMatrix(
    dictionary: string[], 
    solution: string, 
    graph: InputSeries
): string[][] {
    const matrix: string[][] = [[], [], [], [], [], []];

    for (let i = 0; i < 6; i += 1) {
        const targetPattern = graph[i];
        if (targetPattern === undefined) { continue; }

        // After a row is correct, all successive rows must be absent
        let isAfterWin = false;
        if (i > 0) {
            const prevPattern = graph[i - 1];
            if (prevPattern !== undefined) {
                isAfterWin = isRowAllCorrect(prevPattern);
            }
        }

        if (isAfterWin && isRowAllGrey(targetPattern)) {
            matrix[i] = [""]; 
            continue;
        }

        matrix[i] = findMatchingWords(dictionary, solution, targetPattern);
    }
    return matrix;
}

// Finds all possible series with each word from the first row, until MAX_SOLUTIONS entries
function collectSolutionSeries(
    matrix: string[][],
    currentRow: number,
    currentSeries: string[],
    solutions: Set<SolutionSeries>
): void {
    if (solutions.size >= MAX_SOLUTIONS) { return; }

    // Found a complete series of 6 words
    if (currentRow === 6) {
        const [s0, s1, s2, s3, s4, s5] = currentSeries;
        if (
            s0 !== undefined && s1 !== undefined && s2 !== undefined &&
            s3 !== undefined && s4 !== undefined && s5 !== undefined
        ) {
            solutions.add([s0, s1, s2, s3, s4, s5]);
        }
        return;
    }

    const possibleWords = matrix[currentRow];
    if (possibleWords === undefined) { return; }

    // Try every word in the current row and descend to the next
    for (const word of possibleWords) {
        currentSeries.push(word);
        collectSolutionSeries(matrix, currentRow + 1, currentSeries, solutions);
        currentSeries.pop(); // Remove initial word for next branch of solutionSeries
        
        if (solutions.size >= MAX_SOLUTIONS) { break; }
    }
}

export async function getAllSolutionSeries(
    wordleSolution: string, 
    wordleGraph: InputSeries
): Promise<Set<SolutionSeries>> {
    const dictionarySet = await loadSolutionsCsv();
    const dictionaryArray = [...dictionarySet];
    const solutions = new Set<SolutionSeries>();

    const wordMatrix = buildPossibleWordsMatrix(dictionaryArray, wordleSolution, wordleGraph);

    // Fail if any row has no valid words
    const hasDeadEnd = wordMatrix.some((rowWords) => { return rowWords.length === 0; });
    if (hasDeadEnd) {
        return solutions;
    }

    collectSolutionSeries(wordMatrix, 0, [], solutions);

    return solutions;
}
