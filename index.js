import express from "express";
import bodyParser from "body-parser";
import inferRouter from "./src/views/inferView.js";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import debugAgent from "@google-cloud/debug-agent";

dotenv.config();

debugAgent.start({ serviceContext: { enableCanary: true } });

const app = express();

app.listen(process.env.PORT || 4321, () =>
	console.log(`🏃 Running on port ${process.env.PORT || 4321}`)
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.get("/", (req, res) => res.json({ status: "✅ Running..." }));
app.use("/infer", inferRouter);

export default app;
