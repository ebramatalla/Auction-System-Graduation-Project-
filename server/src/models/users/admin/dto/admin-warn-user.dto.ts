import { IsEnum, IsNotEmpty } from 'class-validator';
import { WarningMessagesEnum } from '../enums';

export class AdminWarnUserDto {
	@IsNotEmpty()
	@IsEnum(WarningMessagesEnum, {
		message: 'Invalid warning message, please enter valid enum value 👀',
	})
	warningMessage: WarningMessagesEnum;
}
