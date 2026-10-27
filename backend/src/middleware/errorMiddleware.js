export const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]', err);

  // Catch duplicate key error from Mongo or In-Memory store
  if (err.code === 11000 || err.message === 'ALREADY_PARTICIPATING') {
    return res.status(409).json({
      success: false,
      errorCode: 'ALREADY_PARTICIPATING',
      message: "You're already participating! You can participate again when a new giveaway event begins.",
    });
  }

  // Insufficient Balance errors
  if (err.message && err.message.startsWith('INSUFFICIENT_')) {
    const currency = err.message.split('_')[1];
    return res.status(400).json({
      success: false,
      errorCode: err.message,
      message: `Not enough ${currency}. Please earn more ${currency} to join this giveaway.`,
    });
  }

  // Giveaway status errors
  if (err.message === 'GIVEAWAY_ENDED') {
    return res.status(400).json({
      success: false,
      errorCode: 'GIVEAWAY_ENDED',
      message: 'This giveaway has ended. Check out the winners and get ready for the next giveaway.',
    });
  }

  if (err.message === 'GIVEAWAY_NOT_ACTIVE') {
    return res.status(400).json({
      success: false,
      errorCode: 'GIVEAWAY_NOT_ACTIVE',
      message: 'This giveaway is currently not active.',
    });
  }

  if (err.message === 'PARTICIPATION_BLOCKED') {
    return res.status(403).json({
      success: false,
      errorCode: 'PARTICIPATION_BLOCKED',
      message: "Participation couldn't be completed. We couldn't verify this participation request. Please try again later or contact support.",
    });
  }

  return res.status(500).json({
    success: false,
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred while processing your request.',
  });
};
