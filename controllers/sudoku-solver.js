class SudokuSolver {
  constructor() {
    this.rows = 'abcdefghi';
    this.numberValues = '123456789';
  }

  validate(puzzleString) {
    const regex = /[^.1-9]/;
    const notString = typeof puzzleString !== 'string';

    if (notString) return false;

    const containsInvalidCharacters = regex.test(puzzleString);
    const isIncorrectLength = puzzleString.length !== 81;

    const isInvalidPuzzleString =
      containsInvalidCharacters || isIncorrectLength;

    if (isInvalidPuzzleString) return false;

    return true;
  }

  validateCoord(coord) {
    const regex = /^[a-i][1-9]$/i;
    const isString = typeof coord === 'string';

    if (isString) {
      const hasValidChars = regex.test(coord);
      if (hasValidChars) {
        return true;
      }
    }

    false;
  }

  getIndexes(coord) {
    const isValidCoord = this.validateCoord(coord);

    if (!isValidCoord) throw 'Invalid Coord';

    const [row, column] = coord.split('');

    return {
      rowIndex: this.rows.indexOf(row),
      columnIndex: parseInt(column) - 1,
    };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const regex = /^[0-9]$/i;
    const validRow = regex.test(row.toString());

    if (!validRow) return false;

    const rowIndex = parseInt(row);
    const start = 0 + 9 * rowIndex;
    const end = 9 + 9 * rowIndex;
    let rowEntries = puzzleString.slice(start, end);

    const isValid = !rowEntries.includes(value.toString());

    return isValid;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const regex = /^[0-9]$/i;
    const validColumn = regex.test(column.toString());

    if (!validColumn) return false;

    let columnIndex = parseInt(column);
    let columnEntries = '';

    for (let i = 0; i < 9; i++) {
      columnEntries += puzzleString[columnIndex + 9 * i];
    }

    const isValid = !columnEntries.includes(value.toString());
    return isValid;
  }

  getRegionIndex(value) {
    return Math.floor(value / 3);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const columnIndex = parseInt(column);
    const regionColumnIndex = this.getRegionIndex(columnIndex);
    const rowIndex = parseInt(row);
    const regionRowIndex = this.getRegionIndex(rowIndex);
    const puzzleIndex = columnIndex + 9 * rowIndex;
    const coordinateValue = puzzleString[puzzleIndex];

    if (coordinateValue === value.toString()) return true;

    let startIndex = 3 * regionColumnIndex + 27 * regionRowIndex;
    let entires = '';

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        entires += puzzleString[startIndex + x + 9 * y];
      }
    }

    const isValid = !entires.includes(value.toString());

    return isValid;
  }

  isValidCellValue(puzzle, row, column, value) {
    const validators = [
      ['checkColPlacement', 'column'],
      ['checkRowPlacement', 'row'],
      ['checkRegionPlacement', 'region'],
    ];

    const conflict = [];

    validators.forEach(([validator, reason]) => {
      const valid = this[validator](puzzle, row, column, value);

      if (!valid) {
        conflict.push(reason);
      }
    });

    return {
      valid: conflict.length === 0,
      conflict,
    };
  }

  solveCell(puzzle, solvedCount, index = 0, hasFoundSolution = false) {
    let solutionExist = hasFoundSolution;

    // if the number cells that have been solved equals the number of cells
    // the puzzle has been solved
    if (solvedCount === puzzle.length) return puzzle.join('');

    // reset index if out of bounds
    // if there were no solutions found after a cycle, the board could not be solved
    if (index === puzzle.length) {
      if (hasFoundSolution === false) return null;
      index = 0;
      solutionExist = false;
    }

    const value = puzzle[index];
    const row = Math.floor(index / 9);
    const column = index - 9 * row;
    const solutions = [];

    // if the cell already has a number skip to the next cell
    if (value !== '.') {
      return this.solveCell(puzzle, solvedCount, index + 1, solutionExist);
    }

    // figure out possible solutions for the cell with constraints
    for (const numVal of this.numberValues) {
      const isValidValue = this.isValidCellValue(puzzle, row, column, numVal);

      if (isValidValue.valid) {
        solutions.push(numVal);
      }
    }

    // if the cell has only one solution, it's solved
    if (solutions.length === 1) {
      puzzle[index] = solutions[0];
      solvedCount++;

      solutionExist = true;
    }

    return this.solveCell(puzzle, solvedCount, index + 1, solutionExist);
  }

  solve(puzzleString) {
    const isValidString = this.validate(puzzleString);
    if (!isValidString) return null;

    const puzzle = puzzleString.split('');
    let solvedCount = 0;

    // initialize the solved count by counting the cells with a number
    puzzle.forEach((cell) => {
      if (cell !== '.') {
        solvedCount += 1;
      }
    });

    const result = this.solveCell(puzzle, solvedCount);
    return result;
  }
}

module.exports = SudokuSolver;
