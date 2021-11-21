const error = (res, message, extra = {}) => {
	res.status(400);
	res.json({ error: message, ...extra });
};

export default error;
