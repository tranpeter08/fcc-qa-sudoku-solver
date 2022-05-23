module.exports = {
  requiredFields(fields = ['puzzle']) {
    return function (req, res, next) {
      for (const field of fields) {
        if (!(field in req.body)) {
          res.send({ error: 'Required field missing' });
          return;
        }
      }

      next();
    };
  },
  validatePuzzleString(req, res, next) {
    const { puzzle } = req.body;

    // test if string contains charcters that are not "." or 1-9
    const regex = /[^.0-9]/;

    const hasMissingCharacters =
      typeof puzzle === 'string' && puzzle.length !== 81;

    if (hasMissingCharacters) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }

    const containsInvalidCharacters = regex.test(puzzle);

    if (containsInvalidCharacters) {
      res.send({ error: 'Invalid characters in puzzle' });
      return;
    }

    next();
  },

  validateCoords(req, res, next) {
    const { coordinate } = req.body;
    const errorPayload = { error: 'Invalid coordinate' };
    const regex = /^[a-i][1-9]$/i;
    const isString = typeof coordinate === 'string';

    if (isString) {
      const hasValidChars = regex.test(coordinate);
      if (hasValidChars) {
        return next();
      }
    }

    return res.json(errorPayload);
  },

  validateValue(req, res, next) {
    const { value } = req.body;
    const stringVal = value.toString();
    const regex = /^[1-9]$/;
    const errorPayload = { error: 'Invalid value' };
    const isValidNumberVal = regex.test(stringVal);

    if (isValidNumberVal) return next();

    return res.json(errorPayload);
  },
};
