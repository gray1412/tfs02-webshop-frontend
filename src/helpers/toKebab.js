export const toKebab = (string) => {
	return string
		.toLowerCase()
		.split(" ")
		.join("-");
};
