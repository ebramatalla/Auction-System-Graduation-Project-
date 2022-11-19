import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { EnumNames } from '../../enums';

export class GetEnumValues {
	@IsNotEmpty()
	@IsEnum(EnumNames, {
		message: `Enum name must be one of the following: [${EnumNames.BlockUserReasonsEnum}, ${EnumNames.WarningMessagesEnum}]`,
	})
	enumName: EnumNames;
}
