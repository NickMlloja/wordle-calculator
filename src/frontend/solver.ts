
interface wordleInput {
    idx1: TileState;
    idx2: TileState;
    idx3: TileState;
    idx4: TileState;
    idx5: TileState;
}

export interface inputSeries {
    input1: wordleInput;
    input2: wordleInput;
    input3: wordleInput;
    input4: wordleInput;
    input5: wordleInput;
    input6: wordleInput;
}

export interface solutionSeries {
    input1: string;
    input2: string;
    input3: string;
    input4: string;
    input5: string;
    input6: string;
}

export function getAllSolutionSeries(): Set<solutionSeries> {
    const solutions = new Set<solutionSeries>;

    // #TODO

    return solutions;
}

export enum TileState {
    Absent  = 0,
    Present = 1,
    Correct = 2,
}