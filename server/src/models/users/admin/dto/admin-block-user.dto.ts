import { IsEnum, IsNotEmpty } from 'class-validator';
import { BlockUserReasonsEnum } from '../enums';

export class AdminBlockUserDto {
	@IsEnum(BlockUserReasonsEnum, {
		message: 'Invalid block reason, please enter valid enum value 👀',
	})
	@IsNotEmpty()
	blockReason: BlockUserReasonsEnum;
}
