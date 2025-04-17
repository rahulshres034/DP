const catchError = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error("Error caught:", err);
      return res.status(500).send(err.message || "Something went wrong");
    }
  };
};

module.exports = catchError;
