// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  // Handle specific errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation error', errors: err.errors });
  }
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate key error' });
  }

  // Default to 500 for unhandled errors
  res.status(500).json({ message: 'Something went wrong on the server' });
};

module.exports = errorHandler;