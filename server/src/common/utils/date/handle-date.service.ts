import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { ExtendAuctionTimeType } from 'src/models/auction/types';

/**
 * This service combine all methods that work with date
 */

@Injectable()
export class HandleDateService {
	constructor() {}

	//? Set the format of the date in chat message
	private static readonly dateFormatForChatMessage: string =
		'dddd, MMMM Do YYYY, h:mm:ss a';

	private static readonly auctionEndDateDifference: number = 7;

	private static readonly auctionSDValidDurationInMonths: number = 2;

	private static readonly dateDelayInMinuets: number = 3;

	/**
	 * Use moment to get the current date in good format
	 * @returns string representing the date in simple format
	 */
	public static getCurrentDateFormatted(): string {
		return moment().format(this.dateFormatForChatMessage);
	}

	/**
	 * Use moment to add period of time to the given start date
	 * @param auctionStartDate - Auction start date
	 * @returns End date for the auction
	 */
	public static getNewEndDateFromStartDate(auctionStartDate: Date) {
		//FIXME: Get it back to valid period
		// return moment(auctionStartDate).add(this.auctionEndDateDifference, 'days');

		//* JUST FOR TESTING PURPOSE
		return moment(auctionStartDate).add(10, 'minutes');
	}

	/**
	 * Append extension time to end date
	 * @param endDate
	 * @param extensionTime
	 * @returns new end date
	 */
	public static appendExtensionAndGetNewEndDate(
		endDate: Date,
		extensionTime: ExtendAuctionTimeType,
	) {
		//* Add extension days , hours and minutes to the end date
		return moment(endDate)
			.add(extensionTime.days, 'days')
			.add(extensionTime.hours, 'hours')
			.add(extensionTime.minutes, 'minutes')
			.toDate();
	}

	/**
	 * Check if the given date is between today and 2 months or not
	 * @param startDate
	 * @boolean true if valid, false otherwise
	 */
	public static isValidAuctionStartDate(startDate: Date) {
		const dateAfter2Months = moment().add(
			this.auctionSDValidDurationInMonths,
			'months',
		);
		return moment(startDate).isBetween(undefined, dateAfter2Months); // moment(undefined) evaluates as moment()
	}

	/**
	 * Check if given date is in the past
	 * @param date
	 */
	public static isInPast(date: Date): boolean {
		//* Check if the given date is in the paste or not
		return moment(date).isBefore(moment());
	}

	/**
	 * Check if given date is in last minute in another date
	 * @param candidateDate
	 */
	public static isInLastMinute(candidateDate: Date, endDate: Date): boolean {
		//* Cast the given date to moment
		const candidateMoment = moment(candidateDate);

		//* Cast the end date to moment
		const endMoment = moment(endDate);

		//* Subtract end date to get the date in last minute
		const lastMinuteDate = moment(endDate).subtract(1, 'minute');

		return candidateMoment.isBetween(lastMinuteDate, endMoment);
	}

	/**
	 * Append delay to end date and get new end date
	 * @param endDate
	 * @returns new date (end date + delay)
	 */
	public static appendDelayToDate(endDate: Date) {
		//* TODO: Get it back to valid period
		// return moment(endDate).add(this.dateDelayInMinuets, 'minutes').toDate();
		return moment(endDate).add('1', 'minute').toDate();
	}

	/**
	 * Get tomorrow date
	 * @returns Tomorrow Date
	 */
	public static getTomorrowDate() {
		//* Get tomorrow date
		return moment().add(1, 'days').toDate();
	}
}
