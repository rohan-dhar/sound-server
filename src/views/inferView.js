import { Router } from "express";
import error from "../utils/error.js";
import { getText } from "../utils/audio.js";
import analyse from "../utils/analyse.js";
import getWords from "../utils/getWords.js";

const router = Router();

const handler = async (req, res) => {
	const audio = req.files ? req.files.audio : null;
	if (!audio) {
		return error(res, "No audio file found", {
			files: req.files || "None",
			body: req.body,
		});
	}

	const [text, textError] = await getText(audio);
	if (textError) {
		return error(res, `Could not get text. Cause: ${textError}`);
	}

	const [analysis, emotionError] = await analyse(text);
	if (emotionError) {
		return error(res, `Could not derive emotions. Cause: ${emotionError}`);
	}

	res.json({ text, ...analysis, words: getWords(text) });
};

router.post("/", handler);

export default router;
