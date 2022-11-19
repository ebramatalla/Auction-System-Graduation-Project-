import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './index';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
