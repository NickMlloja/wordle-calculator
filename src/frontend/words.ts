let cachedSolutionSet: Set<string> | null = null;

async function loadSolutionsCsv(): Promise<Set<string>> {
    if (cachedSolutionSet !== null) { return cachedSolutionSet; }

    const response: Response = await fetch("/words/solutions.csv");
    const text: string = await response.text();

    const lines: string[] = text.split("\n").map(line => line.trim().toLowerCase());
    const set: Set<string> = new Set(lines.filter(word => word.length === 5));

    cachedSolutionSet = set;
    return cachedSolutionSet;
}

export async function isValidWordleSolution(word: string): Promise<boolean> {
    const solutionSet: Set<string> = await loadSolutionsCsv();
    return solutionSet.has(word.toLowerCase());
}
