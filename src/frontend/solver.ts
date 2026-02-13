
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