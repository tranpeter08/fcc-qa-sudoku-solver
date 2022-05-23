const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzles = require('../controllers/puzzle-strings');

chai.use(chaiHttp);
const SOLVE_ENDPOINT = '/api/solve';
const CHECK_ENDPOINT = '/api/check';

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    const [puzzleString, answer] = puzzles[0];
    chai
      .request(server)
      .post(SOLVE_ENDPOINT)
      .send({ puzzle: puzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        assert.equal(res.body.solution, answer);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    const ERROR_MESSAGE = 'Required field missing';

    chai
      .request(server)
      .post(SOLVE_ENDPOINT)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, ERROR_MESSAGE);
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    const [puzzleString, answer] = puzzles[0];
    const ERROR_MESSAGE = 'Invalid characters in puzzle';
    const stringArray = puzzleString.split('');
    stringArray[30] = 'x';
    const invalidString = stringArray.join('');

    chai
      .request(server)
      .post(SOLVE_ENDPOINT)
      .send({ puzzle: invalidString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, ERROR_MESSAGE);
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    const [puzzleString, answer] = puzzles[0];
    const ERROR_MESSAGE = 'Expected puzzle to be 81 characters long';
    const stringArray = puzzleString.split('');
    stringArray.pop();

    const invalidString = stringArray.join('');

    chai
      .request(server)
      .post(SOLVE_ENDPOINT)
      .send({ puzzle: invalidString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, ERROR_MESSAGE);
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    const unsolvablePuzzle = '.'.repeat(81);
    const ERROR_MESSAGE = 'Puzzle cannot be solved';

    chai
      .request(server)
      .post(SOLVE_ENDPOINT)
      .send({ puzzle: unsolvablePuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, ERROR_MESSAGE);
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    const [puzzleString, answer] = puzzles[0];
    const coord = 'a2';
    const value = 3;

    chai
      .request(server)
      .post(CHECK_ENDPOINT)
      .send({ puzzle: puzzleString, coordinate: coord, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, true);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    const [puzzleString, answer] = puzzles[0];
    const coord = 'a2';
    const value = 9;

    chai
      .request(server)
      .post(CHECK_ENDPOINT)
      .send({ puzzle: puzzleString, coordinate: coord, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'conflict');
        assert.equal(res.body.conflict.length, 1);
        assert.equal(res.body.conflict[0], 'column');
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    const [puzzleString, answer] = puzzles[0];
    const coord = 'e6';
    const value = 6;
    const conflicts = ['row', 'column'];

    chai
      .request(server)
      .post(CHECK_ENDPOINT)
      .send({ puzzle: puzzleString, coordinate: coord, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'conflict');
        assert.equal(res.body.conflict.length, 2);
        conflicts.forEach((conflict) => {
          assert.equal(res.body.conflict.includes(conflict), true);
        });

        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    const [puzzleString, answer] = puzzles[0];
    const coord = 'a2';
    const value = 2;
    const conflicts = ['row', 'column', 'region'];

    chai
      .request(server)
      .post(CHECK_ENDPOINT)
      .send({ puzzle: puzzleString, coordinate: coord, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'conflict');
        assert.equal(res.body.conflict.length, 3);
        conflicts.forEach((conflict) => {
          assert.equal(res.body.conflict.includes(conflict), true);
        });

        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    const ERROR_MESSAGE = 'Required field(s) missing';
    chai
      .request(server)
      .post(CHECK_ENDPOINT)
      .send({ puzzle: '' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, ERROR_MESSAGE);

        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    const [puzzleString, answer] = puzzles[0];
    const ERROR_MESSAGE = 'Expected puzzle to be 81 characters long';
    const stringArray = puzzleString.split('');
    stringArray.pop();
    const invalidString = stringArray.join('');

    chai
      .request(server)
      .post(CHECK_ENDPOINT)
      .send({ puzzle: invalidString, value: 7, coordinate: 'a1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, ERROR_MESSAGE);

        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    const [puzzleString, answer] = puzzles[0];
    const ERROR_MESSAGE = 'Invalid characters in puzzle';
    const stringArray = puzzleString.split('');
    stringArray[30] = 'x';
    const invalidString = stringArray.join('');

    chai
      .request(server)
      .post(CHECK_ENDPOINT)
      .send({ puzzle: invalidString, value: 7, coordinate: 'a1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, ERROR_MESSAGE);

        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    const [puzzleString, answer] = puzzles[0];
    const ERROR_MESSAGE = 'Invalid coordinate';
    const invalidCoord = 'z-1';
    const value = 7;

    chai
      .request(server)
      .post(CHECK_ENDPOINT)
      .send({ puzzle: puzzleString, value, coordinate: invalidCoord })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, ERROR_MESSAGE);

        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    const [puzzleString, answer] = puzzles[0];
    const ERROR_MESSAGE = 'Invalid value';
    const invalidValue = 900;
    const coord = 'a1';

    chai
      .request(server)
      .post(CHECK_ENDPOINT)
      .send({ puzzle: puzzleString, value: invalidValue, coordinate: coord })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, ERROR_MESSAGE);

        done();
      });
  });
});
