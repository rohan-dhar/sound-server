import { LanguageServiceClient } from "@google-cloud/language";
import axios from "axios";
import { BAD_WORDS_API_URL } from "../../conf.js";

const analyse = async (text) => {
	const client = new LanguageServiceClient();

	const runners = [
		{
			key: "sentiment",
			run: async (document) => {
				const [resp] = await client.analyzeSentiment({ document });
				if (!resp.documentSentiment) return { score: 0, magnitude: 0 };
				return resp.documentSentiment;
			},
		},
		// {
		// 	key: "syntax",
		// 	run: async (document) => {
		// 		const [resp] = await client.analyzeSyntax({
		// 			document,
		// 		});
		// 		return resp;
		// 	},
		// },

		{
			key: "cussWords",
			run: async () => {
				// return { words: [], totalUsed: 0 };
				let response = await axios({
					url: BAD_WORDS_API_URL,
					method: "POST",
					headers: {
						"Content-type": "application/json",
						apikey: process.env.BAD_WORDS_API_KEY,
					},
					data: document.content,
				});

				if (
					!response ||
					!response.data ||
					!response.data.bad_words_total
				) {
					return { words: [], totalUsed: 0 };
				}

				response = response.data;

				return {
					words: response.bad_words_list.map(
						(wordData) => wordData.word
					),
					totalUsed: response.bad_words_total,
				};
			},
		},
	];

	const document = {
		content: text,
		type: "PLAIN_TEXT",
	};

	let responses;

	try {
		responses = await Promise.all(
			runners.map((runner) => {
				console.log(`Running ${runner.key}`);
				return runner.run(document);
			})
		);
	} catch (err) {
		console.log(`err`, err);
		return [null, err];
	}

	const result = {};

	runners.forEach((runner, index) => {
		result[runner.key] = responses[index];
	});

	return [result, null];
};

export default analyse;
