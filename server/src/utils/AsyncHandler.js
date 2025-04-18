const AsyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ineternal server error",
    });
  }
};

export default AsyncHandler;
