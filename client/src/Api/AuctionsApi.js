const url = 'http://localhost:8000/auctions';

const getAuctions = async url => {
	const response = await fetch(url);
	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message);
	}
	return data;
};

// upgoing
// ongoing
// closed

export const getAllAuctions = async queryParams => {
	return getAuctions(`${url}${queryParams ? queryParams : '?'}populate=true`);
};
// export const getFilterAuction = async (queryParams) => getAuctions(`${url}${queryParams}populate=true`);

export const getUpComingAuctions = async () =>
	getAuctions(`${url}?status=upcoming&populate=true`);
export const getOnGoingAuctions = async () =>
	getAuctions(`${url}?status=ongoing&populate=true`);
export const getSavedAuctions = async () =>
	getAuctions(`${url}?status=saved&populate=true`);
// export const getJoinedAuctions = async () =>
// 	getAuctions(`${url}?status=joinedAuctions&populate=true`);
// export const getClosedAuctions = async () => getAuctions(`${url}?status=closed&populate=true`)
export const getSingleAuction = async auctionId =>
	getAuctions(`${url}/${auctionId}?populate=true`);

export const DeleteAuctionHandler = async ({ AuctionId, accessToken }) => {
	const response = await fetch(
		`http://localhost:8000/seller/auction/${AuctionId}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'content-type': 'application/json',
			},
		},
	);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}
};

export const UpdateAuctionHandler = async ({
	AuctionId,
	auctionData,
	idToken,
}) => {
	const formData = new FormData();

	//* Append auction details to form data
	for (let dataKey in auctionData) {
		//* If dataKey is item so it is a nested object
		if (dataKey === 'item') {
			//* Loop over item object and append each key value pair to form data
			for (let item in auctionData[dataKey]) {
				//* If the key is image then append the images to form data as array
				if (item === 'images') {
					//* Loop over each image and append to form data
					for (let i = 0; i < auctionData[dataKey][item].length; i++) {
						//* Append the images to form data as an array (NOTE: [] is required)
						formData.append(`item[images][]`, auctionData[dataKey][item][i]);
					}
				} else {
					formData.append(`item[${item}]`, auctionData[dataKey][item]);
				}
			}
		} else {
			formData.append(dataKey, auctionData[dataKey]);
		}
	}
	const response = await fetch(
		`http://localhost:8000/seller/auction/${AuctionId}`,
		{
			method: 'PATCH',
			body: formData,
			headers: {
				Authorization: `Bearer ${idToken}`,

			},
		},
	);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}
};
