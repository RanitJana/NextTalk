const _env = Object.freeze({
  PORT: process.env.PORT,
  ORIGIN: process.env.ORIGIN,
  ACCESS_TOEKN_SEC: process.env.ACCESS_TOEKN_SEC,
  ACCESS_TOEKN_EXP: process.env.ACCESS_TOEKN_EXP,
  REFRESH_TOKEN_SEC: process.env.REFRESH_TOKEN_SEC,
  REFRESH_TOKEN_EXP: process.env.REFRESH_TOKEN_EXP,
});

export { _env };
