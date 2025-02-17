const errorHandler = (err, req, res, next) => {
    console.error("Error Middleware Triggered:", err);
  
    const statusCode = err.statusCode || 500;
  
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  };
  
  export { errorHandler };
  