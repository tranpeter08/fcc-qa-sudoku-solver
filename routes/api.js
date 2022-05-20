'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const {
  validatePuzzleString,
  requiredFields,
  validateCoords,
  validateValue,
} = require('../middlewares/validators');
const express = require('express');

/**
 *
 * @param {express.Express} app
 */
module.exports = function (app) {
  const solver = new SudokuSolver();
  const checkFields = ['puzzle', 'coordinate', 'value'];

  app
    .route('/api/check')
    .post(
      requiredFields(checkFields),
      validatePuzzleString,
      validateCoords,
      validateValue,
      (req, res) => {
        const { puzzle, coordinate, value } = req.body;
        const { columnIndex, rowIndex } = solver.getIndexes(coordinate);

        const isValidValue = solver.isValidCellValue(
          puzzle,
          rowIndex,
          columnIndex,
          value
        );

        if (isValidValue.valid) {
          delete isValidValue.conflict;
        }

        res.json(isValidValue);
      }
    );

  app
    .route('/api/solve')
    .post(requiredFields(), validatePuzzleString, (req, res) => {
      const { puzzle } = req.body;
      const solution = solver.solve(puzzle);

      res.json({ solution });
    });
};
