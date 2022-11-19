export enum AuctionStatus {
	Pending = 'pending', // Need an action (approve or reject)
	OnGoing = 'ongoing', // Currently running auctions
	UpComing = 'upcoming', // Listed auctions to run later
	Denied = 'denied', // Auction not approved (rejected)
	Closed = 'closed', // Auction reached the end date
}

// This enum used by users to filter the auctions (look at filter-auctions.dto.ts)
export enum AuctionStatusForSearch {
	UpComing = 'upcoming',
	OnGoing = 'ongoing',
	Closed = 'closed',
	// normal users not allowed to see denied or pending auctions
}
