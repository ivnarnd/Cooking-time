import passport from "passport";
import local from "passport-local";
import userRouter from "../routes/users.routes";
import { createHash,validatePassword } from "../utils/utils";