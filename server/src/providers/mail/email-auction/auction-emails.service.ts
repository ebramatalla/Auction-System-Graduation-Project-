import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ResponseResult } from 'src/common/types';
import { Auction } from 'src/models/auction/schema/auction.schema';
import { Buyer } from 'src/models/users/buyer/schema/buyer.schema';
import { UserDocument } from 'src/models/users/shared-user/schema/user.schema';
import { UsersService } from 'src/models/users/shared-user/users.service';
import EmailService from 'src/providers/mail/email.service';
import { getBlockUserEmailContent } from './content/block-user-content';
import { getEmailAuctionWinnerContent } from './content/email-auction-winner-content';
import { getNotifyAuctionStartContent } from './content/notify-auction-start-content';
import { getWarnUserEmailContent } from './content/warn-user-content';

@Injectable()
export class AuctionEmailsService {
	private logger: Logger = new Logger(AuctionEmailsService.name);

	//* Inject required services
	constructor(private readonly emailService: EmailService) {}

	/**
	 * Send email to list of bidders to notify that auction started
	 * @param auction: Auction details
	 * @param biddersEmailsList: List of bidders emails
	 */
	async notifyBiddersAuctionStart(
		auction: Auction,
		biddersEmailsList: string[],
	) {
		//? Get the email content
		const emailText = getNotifyAuctionStartContent(auction);

		//? Send the email
		const emailStatus: boolean = await this.emailService.sendMail({
			to: biddersEmailsList,
			subject: 'Online Auction - Auction started Notification 🔔',
			html: emailText,
		});

		if (emailStatus) {
			this.logger.log('Email has been sent to all bidders 📧');
			return true;
		} else {
			this.logger.log(
				'Cannot sent notification email right now right now ❌😢',
			);
			return false;
		}
	}

	/**
	 * Send email to auction's winner
	 * @param auction: Auction details
	 * @param winnerBidder: Bidder object
	 */
	async sendToWinnerBidder(auction: Auction, winnerBidder: Buyer) {
		//? Get the email content
		const emailText = getEmailAuctionWinnerContent(auction, winnerBidder);

		//? Send the email
		const emailStatus: boolean = await this.emailService.sendMail({
			to: winnerBidder.email,
			subject: 'Online Auction - Auction Winner 🎉',
			html: emailText,
		});

		if (emailStatus) {
			this.logger.log(`Email has been sent auction's winner 📧`);
			return true;
		} else {
			this.logger.log(
				"Cannot sent email to auction's winner right now right now ❌😢",
			);
			return false;
		}
	}

	/**
	 * Send email to inform user about warning or blocking
	 * @param options - Data about the user and auction
	 */
	async notifyUserAboutAction(options: {
		user: UserDocument;
		block?: boolean;
		blockReason?: string;
		warn?: boolean;
		warningMessage?: string;
	}) {
		let emailText: string;
		if (options.block && options.blockReason) {
			//? Get the email content
			emailText = getBlockUserEmailContent({
				username: options.user.name,
				blockReason: options.blockReason,
			});
		} else if (options.warn && options.warningMessage) {
			emailText = getWarnUserEmailContent({
				username: options.user.name,
				warningMessage: options.warningMessage,
			});
		}

		//? Send the email
		const emailStatus: boolean = await this.emailService.sendMail({
			to: options.user.email,
			subject: 'Online Auction - Action against you ⚠',
			html: emailText,
		});

		if (emailStatus) {
			this.logger.log(`Email has been sent to ${options.user.name} 📧`);
			return true;
		} else {
			this.logger.log('Cannot sent email right now ❌😢');
			return false;
		}
	}
}
