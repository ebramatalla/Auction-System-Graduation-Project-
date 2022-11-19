import { IsString } from 'class-validator';

export class RejectExtendTimeDto {
	@IsString()
	message: string = 'NO REASON SUPPLIED 😢';
}
