import express from "express";
import branchRouter from "./branch";
const v1router = express.Router();

v1router.use("/branch", branchRouter);

export default v1router;
