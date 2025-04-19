import AsyncHandler from "../utils/AsyncHandler.js";
import messageSchema from "../models/message.model.js";

const postMessage = AsyncHandler(async (req, res) => {
  console.log(req.user);

  return res.status(200).json({
    success: true,
    message: "added",
  });
});

export { postMessage };
