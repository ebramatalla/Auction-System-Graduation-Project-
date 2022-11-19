import { Logger } from '@nestjs/common';

/**
 * This service used to handle the Bidding Increment Rules for the system.
 * This site is setup for whole dollar bidding only (no cents allowed, e.g $15).
 */

export class BiddingIncrementRules {
	private readonly logger: Logger = new Logger(BiddingIncrementRules.name);

	public calcBidIncrementBasedOnValue(currentValue: number) {
		//* If the current value is between 1 and 49, then the bid increment is 5
		if (currentValue >= 1 && currentValue <= 49) {
			return 5;
		}

		//* If the current value is between 50 and 99, then the bid increment is 10
		if (currentValue >= 50 && currentValue <= 99) {
			return 10;
		}

		//* If the current value is between 100 and 249, then the bid increment is 15
		if (currentValue >= 100 && currentValue <= 249) {
			return 15;
		}

		//* If the current value is between 250 and 299, then the bid increment is 25
		if (currentValue >= 250 && currentValue <= 299) {
			return 25;
		}

		//* If the current value is between 400 and 749, then the bid increment is 50
		if (currentValue >= 400 && currentValue <= 749) {
			return 50;
		}

		//* If the current value is between 750 and 1999, then the bid increment is 100
		if (currentValue >= 750 && currentValue <= 1999) {
			return 100;
		}

		//* If the current value is between 2000 and 4999, then the bid increment is 200
		if (currentValue >= 2000 && currentValue <= 4999) {
			return 200;
		}

		//* If the current value is between 5000 and 9999, then the bid increment is 250
		if (currentValue >= 5000 && currentValue <= 9999) {
			return 250;
		}

		//* If the current value is greater than 10000, then the bid increment is 400
		if (currentValue >= 10000) {
			return 400;
		}
	}
}

/*
* Bidding Increment Rules

- Current Price	- Bid Increment
		$1 - $49					5$
		$50 - $99					10$
		$100 - $249				15$
		$250 - $399				25$
		$400 - $749				50$
		$750 - $1999			100$
		$2,000 - $4,999		200$
		$5,000 - $9,999		250$
		$10,000+					400$

*/
