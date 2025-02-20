import { Router } from "express";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteMessage,
  getMessages,
  getUserList,
  sendMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/users").get(getUserList);
router.route("/:id").get(getMessages);
router
  .route("/send/:id")
  .post(upload.single("media"), sendMessage);

router.route("/message/:messageId").delete(deleteMessage)

export default router;
