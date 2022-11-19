import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
	private logger: Logger = new Logger(SocketService.name);
	public socket: Server = null;

	public emitEvent(event: string, data: any) {
		if (this.socket) {
			this.logger.debug('Emit new event: ' + event);

			this.socket.to(data.toString()).emit(event, {
				message: 'Auction has been ended 🔚',
				system: true,
			});
		}
	}
}
