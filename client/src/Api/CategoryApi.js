const url = 'http://localhost:8000/categories';

const getCategories = async (url, idToken) => {
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${idToken}`,
			'Content-Type': 'application/json',
		},
	});
	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message);
	}
	return data;
};

export const getAllCategories = async idToken =>
	getCategories(`${url}`, idToken);

export const getCategoryAuctions = async id => {
	const response = await fetch(`${url}/${id}/auctions?populate=true`);
	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message);
	}
	return data;
};
