import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

import { Module } from '@nestjs/common';

@Module({
	imports: [],
	controllers: [EmployeeController],
	providers: [EmployeeService],
	exports: [EmployeeService],
})
export class EmployeeModule {}
