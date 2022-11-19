const url = 'http://localhost:8000/seller/auction';

export const AddNewAuctionAPI = async ({ AuctionDetails, idToken }) => {
	const formData = new FormData();

	//* Append auction details to form data
	for (let dataKey in AuctionDetails) {
		//* If dataKey is item so it is a nested object
		if (dataKey === 'item') {
			//* Loop over item object and append each key value pair to form data
			for (let item in AuctionDetails[dataKey]) {
				//* If the key is image then append the images to form data as array
				if (item === 'images') {
					//* Loop over each image and append to form data
					for (let i = 0; i < AuctionDetails[dataKey][item].length; i++) {
						//* Append the images to form data as an array (NOTE: [] is required)
						formData.append(`item[images][]`, AuctionDetails[dataKey][item][i]);
					}
				} else {
					formData.append(`item[${item}]`, AuctionDetails[dataKey][item]);
				}
			}
		} else {
			formData.append(dataKey, AuctionDetails[dataKey]);
		}
	}

	const response = await fetch(url, {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: `Bearer ${idToken}`,
		},
	});
	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
};

export const ExtendAuctionAi = async ({ AuctionId, idToken, ExtendData }) => {
	const response = await fetch(
		`http://localhost:8000/seller/auction/extend/${AuctionId}`,
		{
			method: 'PATCH',
			body: JSON.stringify(ExtendData),
			headers: {
				Authorization: `Bearer ${idToken}`,
				'content-type': 'application/json',
			},
		},
	);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}
};

export const GetExtensionRequest = async idToken => {
	const response = await fetch(
		`http://localhost:8000/seller/auction/extension-requests`,
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
