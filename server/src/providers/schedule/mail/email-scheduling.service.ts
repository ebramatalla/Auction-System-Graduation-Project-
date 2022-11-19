import { Injectable } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import EmailService from '../../mail/email.service';

@Injectable()
export class EmailSchedulingService {
	constructor(
		private readonly emailService: EmailService,
		private readonly schedulerRegistry: SchedulerRegistry,
	) {}

	scheduleEmail(emailSchedule: any) {
		const date = new Date(emailSchedule.date);
		const job = new CronJob(date, () => {
			this.emailService.sendMail({
				to: emailSchedule.recipient,
				subject: emailSchedule.subject,
				text: emailSchedule.content,
			});
		});

		this.schedulerRegistry.addCronJob(
			// Unique job name
			`${Date.now()}-${emailSchedule.subject}`,
			job,
		);
		job.start();
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
