import { SpeechClient } from "@google-cloud/speech";

export const getText = async (file) => {
	let bytes = file.data.toString("base64");

	const audio = {
		content: bytes,
	};

	const config = {
		encoding: "ENCODING_UNSPECIFIED",
		sampleRateHertz: 48000,
		audioChannelCount: 1,
		languageCode: "en-US",
		enableAutomaticPunctuation: true,
		enableSpokenPunctuation: true,
	};
	const request = {
		audio,
		config,
	};
	try {
		const client = new SpeechClient();

		let [response] = await client.recognize(request);

		const text = response.results
			.map((result) => result.alternatives[0].transcript)
			.join("\n");

		return [text, null];
	} catch (err) {
		return [null, err];
	}
};
