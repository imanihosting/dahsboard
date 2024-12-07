const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
  return [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('role').isIn(['parent', 'childminder', 'admin']),
  ];
};

const profileValidationRules = () => {
  return [
    body('name').notEmpty().trim(),
    body('contact_number').matches(/^\+?[\d\s-]+$/),
    body('address').notEmpty().trim(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  userValidationRules,
  profileValidationRules,
  validate,
}; 