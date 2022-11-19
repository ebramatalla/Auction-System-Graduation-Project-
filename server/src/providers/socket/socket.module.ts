import { SocketService } from './socket.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
	imports: [],
	providers: [SocketService],
	exports: [SocketService],
})
export class SocketModule {}
