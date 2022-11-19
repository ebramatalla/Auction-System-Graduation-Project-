export const UpdateAccount = async ({ accountData, idToken, path }) => {

	const formData = new FormData();
	for (let dataKey in accountData) {
		formData.append(dataKey, accountData[dataKey]);
	}

	const response = await fetch(`http://localhost:8000/${path}`, {
		method: 'PATCH',
		body : formData,
		headers: {
			Authorization: `Bearer ${idToken}`,
		},
	});
	const data = await response.json();

	if (!response.ok || data.success === false) {
		throw new Error(data.message);
	}
};
