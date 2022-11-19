import { Injectable, Inject, Logger, forwardRef } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as moment from 'moment';
import { HandleDateService } from 'src/common/utils';
import { AuctionsService } from 'src/models/auction/auctions.service';
import { AuctionStatus } from 'src/models/auction/enums';
import { SocketService } from 'src/providers/socket/socket.service';

@Injectable()
export class AuctionSchedulingService {
	private readonly logger = new Logger(AuctionSchedulingService.name);

	constructor(
		@Inject(forwardRef(() => AuctionsService)) // To avoid Circular dependency between the tow services
		private readonly auctionService: AuctionsService,
		private readonly schedulerRegistry: SchedulerRegistry,
		private readonly socketService: SocketService,
	) {}

	/**
	 * Used to create new cron job for auction to start automatically
	 * @param auctionId - Cron job name
	 * @param startDate - start date
	 */
	addCronJobForStartAuction(auctionId: string, startDate: Date) {
		const job = new CronJob(startDate, async () => {
			//* Mark the auctions as started
			await this.auctionService.markAuctionAsStarted(auctionId);

			//? Get auction end date to create bew cron job
			const result = await this.auctionService.getAuctionEndDate(auctionId);

			//* Remove this cron job to avoid duplicate problem
			this.deleteCron(auctionId);

			//* Create Cron Job for auction end date
			this.addCronJobForEndAuction(auctionId, result.endDate);
		});

		//* Add the cron job to schedule registry
		this.schedulerRegistry.addCronJob(auctionId, job);
		job.start();

		this.logger.debug(
			'New Cron Job added for start auction at ' + moment(startDate).format(),
		);

		this.getCrons();
	}

	/**
	 * Used to create new cron job for auction to start automatically
	 * @param auctionId - Cron job name
	 * @param endDate - start date
	 */
	addCronJobForEndAuction(auctionId: string, endDate: Date) {
		const job = new CronJob(endDate, async () => {
			//* Mark the auctions as ended
			await this.auctionService.markAuctionAsEnded(auctionId);

			//* Notify all bidders that auction is ended
			this.socketService.emitEvent('auction-ended', auctionId);

			//* Remove this cron job to avoid duplicate problem
			this.deleteCron(auctionId);
		});

		//* Add the cron job to schedule registry
		this.schedulerRegistry.addCronJob(auctionId, job);
		job.start();

		this.logger.debug(
			'New Cron Job added for end auction at ' + moment(endDate).format(),
		);

		this.getCrons();
	}

	/**
	 * This method used to reload all cron jobs for auctions
	 */
	async loadCronJobsForAuctions() {
		this.loadCronJobsForUpcomingAuctions();
		this.loadCronJobsForOngoingAuctions();
	}

	/**
	 * Load all cron jobs for any ongoing auctions if any
	 */
	private async loadCronJobsForUpcomingAuctions() {
		this.logger.debug('Loading cron jobs for upcoming auctions...');

		//* Get all upcoming auctions
		const upcomingAuctions = await this.auctionService.getAuctionByStatus(
			AuctionStatus.UpComing,
		);

		//* For each upcoming auction, create cron job for start auction
		let count = 0;
		upcomingAuctions.forEach(auction => {
			if (!HandleDateService.isInPast(auction.startDate)) {
				this.addCronJobForStartAuction(auction.id, auction.startDate);
				count++;
			}
		});

		if (upcomingAuctions.length > 0) {
			this.logger.debug(`${count} upcoming auctions loaded!`);
		} else {
			this.logger.debug('No upcoming auctions found to be loaded!');
		}
	}

	/**
	 * Load all cron jobs for any ongoing auctions if any
	 */
	private async loadCronJobsForOngoingAuctions() {
		this.logger.debug('Loading cron jobs for ongoing auctions...');

		//* Get all incoming auctions
		const ongoingAuctions = await this.auctionService.getAuctionByStatus(
			AuctionStatus.OnGoing,
		);

		//* For each ongoing auction, create cron job for end date
		let count = 0;
		ongoingAuctions.forEach(auction => {
			if (!HandleDateService.isInPast(auction.endDate)) {
				this.addCronJobForEndAuction(auction.id, auction.endDate);
				count++;
			}
		});

		if (ongoingAuctions.length > 0) {
			this.logger.debug(`${count} ongoing auctions loaded!`);
		} else {
			this.logger.debug('No ongoing auctions found to be loaded!');
		}
	}

	/**
	 * List all cron jobs
	 */
	getCrons() {
		const jobs = this.schedulerRegistry.getCronJobs();
		jobs.forEach((value, key, map) => {
			let next;
			try {
				next = value.nextDates().toDate();
			} catch (e) {
				next = 'error: next fire date is in the past!';
			}
			this.logger.debug(`job: ${key} -> next: ${next}`);
		});
	}

	/**
	 * Delete specified cron job
	 * @param name
	 */
	deleteCron(name: string) {
		this.schedulerRegistry.deleteCronJob(name);
		this.logger.debug(`Cron job of auction ${name} deleted!`);
	}
}

/*
 ┌────────────── second (optional)
 │ ┌──────────── minute
 │ │ ┌────────── hour
 │ │ │ ┌──────── day of the month
 │ │ │ │ ┌────── month
 │ │ │ │ │ ┌──── day of week (0 or 7 are Sunday)
 │ │ │ │ │ │
 │ │ │ │ │ │
 * * * * * *
*/
