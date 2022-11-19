export type NewBid = {
	amount: number;
	auction: string;
	user: {
		name: string;
		email: string;
	};
	createdAt: Date;
};
