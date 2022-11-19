const url = 'http://localhost:8000/chat';

export const getChats = async idToken => {
	const response = await fetch(`${url}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${idToken}`,
		},
	});
	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message);
	}
	return data;
};
