import { Expose } from 'class-transformer';
import { UserDto } from '../../shared-user/dto';

/**
 * Category dto - Describe what category data to be sent over the network
 */
export class EmployeeDto extends UserDto {
	@Expose()
	isEmployee: boolean;
}
