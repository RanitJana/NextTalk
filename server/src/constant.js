const _env = Object.freeze({
  PORT: process.env.PORT,
  ORIGIN: process.env.ORIGIN,
  MONGODB_URI: process.env.MONGODB_URI,
  ACCESS_TOEKN_SEC: process.env.ACCESS_TOEKN_SEC,
  ACCESS_TOEKN_EXP: process.env.ACCESS_TOEKN_EXP,
  REFRESH_TOKEN_SEC: process.env.REFRESH_TOKEN_SEC,
  REFRESH_TOKEN_EXP: process.env.REFRESH_TOKEN_EXP,
});

const DB_NAME = "NextTalk";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export { _env, DB_NAME, cookieOptions };
