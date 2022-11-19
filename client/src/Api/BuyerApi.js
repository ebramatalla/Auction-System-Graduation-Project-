const url = 'http://localhost:8000';

const getAPI = async (url, idToken) => {
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

export const getWalletBalance = async idToken =>
	getAPI(`${url}/wallet/balance`, idToken);
export const getWalletTransactions = async idToken =>
	getAPI(`${url}/wallet/transactions`, idToken);

export const getJoinedAuctions = async ({ idToken, buyerId }) => {
	const response = await fetch(
		`${url}/buyer/auctions?populateField=joinedAuctions&buyerId=${buyerId}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${idToken}`,
				'Content-Type': 'application/json',
			},
		},
	);
	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message);
	}
	return data;
};

export const SaveAuctionApi = async ({ idToken, id }) => {
	const response = await fetch(`${url}/buyer/auction/save/${id}`, {
		method: 'POST',
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

export const viewSaveAuctionApi = async ({ idToken, buyerId }) => {
	console.log({ idToken });
	console.log({ buyerId });
	const response = await fetch(
		`${url}/buyer/auctions?populateField=savedAuctions&buyerId=${buyerId}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${idToken}`,
				'Content-Type': 'application/json',
			},
		},
	);
	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message);
	}
	return data;
};

// start join auction request
export const joinAuctionApi = async ({ idToken, id }) => {
	const response = await fetch(`${url}/buyer/auction/join/${id}`, {
		method: 'POST',
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

// start check if this auction is saved before or not

export const CheckIfAuctionSaved = async ({ idToken, id }) => {
	const response = await fetch(`${url}/buyer/auction/is-saved/${id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${idToken}`,
			'Content-Type': 'application/json',
		},
	});
	const data = await response.json();
	if (!response.ok || !data.success) {
		throw new Error(data.message);
	}
	return data;
};
