const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
const puzzles = require('../controllers/puzzle-strings');
let solver = new Solver();

suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters', (done) => {
    const puzzleString = puzzles[0][0];

    const isValid = solver.validate(puzzleString);
    assert.equal(isValid, true);
    done();
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
    let stringWithInvalidChar = '.'.repeat(80) + 'a';
    let isValid = solver.validate(stringWithInvalidChar);

    assert.equal(isValid, false);

    stringWithInvalidChar = '.'.repeat(80) + '0';
    isValid = solver.validate(stringWithInvalidChar);

    assert.equal(isValid, false);
    done();
  });

  test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
    let string = '.'.repeat(8);
    let isValid = solver.validate(string);
    assert.equal(isValid, false);

    string = '.'.repeat(82);
    isValid = solver.validate(string);
    assert.equal(isValid, false);

    done();
  });

  test('Logic handles a valid row placement', (done) => {
    const puzzleString = puzzles[0][0];
    const row = 0;
    const column = 1;
    const value = 3;
    const isValidRow = solver.checkRowPlacement(
      puzzleString,
      row,
      column,
      value
    );

    assert.equal(isValidRow, true);
    done();
  });

  test('Logic handles an invalid row placement', (done) => {
    const puzzleString = puzzles[0][0];
    // check if row is out of bounds
    let row = 10;
    const column = 1;
    const value = 8;
    let isValidRow = solver.checkRowPlacement(puzzleString, row, column, value);
    assert.equal(isValidRow, false);

    // check if cell value violates row constraint
    row = 0;
    isValidRow = solver.checkRowPlacement(puzzleString, row, column, value);

    assert.equal(isValidRow, false);
    done();
  });

  test('Logic handles a valid column placement', (done) => {
    const puzzleString = puzzles[0][0];
    const row = 0;
    const column = 3;
    const value = 8;
    const isValidCol = solver.checkColPlacement(
      puzzleString,
      row,
      column,
      value
    );

    assert.equal(isValidCol, true);
    done();
  });

  test('Logic handles an invalid column placement', (done) => {
    const puzzleString = puzzles[0][0];
    const row = 0;

    // check if column is out of bounds
    let column = 11;
    const value = 3;
    let isValidCol = solver.checkColPlacement(puzzleString, row, column, value);
    assert.equal(isValidCol, false);

    // check if cell value violates column constraint
    column = 3;
    isValidCol = solver.checkColPlacement(puzzleString, row, column, value);

    assert.equal(isValidCol, false);
    done();
  });

  test('Logic handles a valid region placement', (done) => {
    const puzzleString = puzzles[0][0];
    const row = 0;
    const column = 1;
    const value = 3;
    let isValidRegion = solver.checkRegionPlacement(
      puzzleString,
      row,
      column,
      value
    );
    assert.equal(isValidRegion, true);

    done();
  });

  test('Logic handles an invalid region placement', (done) => {
    const puzzleString = puzzles[0][0];
    const row = 0;
    const column = 1;
    const value = 5;
    let isValidRegion = solver.checkRegionPlacement(
      puzzleString,
      row,
      column,
      value
    );

    assert.equal(isValidRegion, false);
    done();
  });

  test('Valid puzzle strings pass the solver', (done) => {
    const [puzzleString, answer] = puzzles[0];
    const { solution } = solver.solve(puzzleString);
    assert.equal(solution, answer);

    done();
  });

  test('Invalid puzzle strings fail the solver', (done) => {
    const puzzleString = '.'.repeat(80) + 'a';
    const result = solver.solve(puzzleString);
    assert.property(result, 'error');

    done();
  });

  test('Solver returns the expected solution for an incomplete puzzle', (done) => {
    const [puzzleString, answer] = puzzles[1];
    const { solution } = solver.solve(puzzleString);
    assert.equal(solution, answer);

    done();
  });
});
