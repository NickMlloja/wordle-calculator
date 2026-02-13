import { loadSolutionsCsv } from "./words";

export enum TileState {
    Absent  = 0,
    Present = 1,
    Correct = 2,
}
export type WordleInput = [
    TileState,
    TileState,
    TileState,
    TileState,
    TileState
];

export type InputSeries = [
    WordleInput,
    WordleInput,
    WordleInput,
    WordleInput,
    WordleInput,
    WordleInput,
];

export type SolutionSeries = [
    string,
    string,
    string,
    string,
    string,
    string,
];

// #AUDIT: If a letter appears once in the solution but you guess more than once, does only one tile turn yellow?
function guessToInput(guess: string, solution: string): WordleInput {

    if (guess.length !== 5 || solution.length !== 5) {
        throw new Error("Expected 5 letter words");
    }

    const result: WordleInput = [
        TileState.Absent,
        TileState.Absent,
        TileState.Absent,
        TileState.Absent,
        TileState.Absent,
    ]

    // For Each Idx
    for (let i = 0; i < 5; i++) {
        
        const currentChar = guess[i];
        if(currentChar === undefined){
            throw new Error(`Expected a character, got ${currentChar}`);
        }

        if(currentChar === solution[i]){
            result[i] = TileState.Correct;
        } else if (solution.includes(currentChar)) {
            result[i] = TileState.Present;
        } else {
            result[i] = TileState.Absent;
        }
    }

    return result;
}

function doesGuessMatchInput(
    guess: WordleInput,
    solution: WordleInput
): boolean {
    for (let i = 0; i < 5; i++) {
        if (guess[i] !== solution[i]) {
            return false;
        }
    }
    return true;
}

// #TODO: Different complexities of solver algos with measured operations
export function getAllSolutionSeries(wordleSolution: string, wordleGraph: InputSeries): Set<SolutionSeries> {
    const solutions = new Set<SolutionSeries>();
    const words = loadSolutionsCsv();

    // #TODO

    return solutions;
}

