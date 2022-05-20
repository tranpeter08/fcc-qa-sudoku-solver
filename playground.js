const puzzles = require('./controllers/puzzle-strings');
const SudokuSolver = require('./controllers/sudoku-solver');

const [[puzzle1]] = puzzles;
const solver = new SudokuSolver();

for (const puzzle of puzzles) {
  const result = solver.solve(puzzle[0]);

  console.log(puzzle[1] === result);
}

// const result = solver.isValidCellValue(puzzle1, 0, 0, 8);
