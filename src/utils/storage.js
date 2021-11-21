import { Storage } from "@google-cloud/storage";
import { GCP_BUCKET } from "../../conf.js";

const upload = async (file, name) =>
	new Promise((res, rej) => {
		const store = new Storage();
		const blob = store.bucket(GCP_BUCKET).file(name);
		const blobStream = blob.createWriteStream({
			resumable: false,
		});
		const buffer = file.buffer;

		blobStream
			.on("finish", () => {
				const gcsUri = `gs://${GCP_BUCKET}/${blob.name}`;
				res([gcsUri, null]);
			})
			.on("error", (error) => {
				res([null, error]);
			})
			.end(buffer);
	});

export { upload };
