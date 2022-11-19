import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RoomMembersService {
	private onlineMembers: any = [];
	private onlineEmployee: any = [];
	private logger: Logger = new Logger();

	/**
	 * Add new member to the list
	 * @param {socketId, email} - member data
	 * @returns member if added || null
	 */
	addMember({ socketId, email }) {
		// Validate data
		if (!socketId || !email) {
			return null;
		}
		// Clean data
		email = email.trim().toLowerCase();

		//? Check if already exists
		const existingMember = this.onlineMembers.find(
			member => member.socketId === socketId && member.email === email,
		);

		if (existingMember) {
			return null;
		}

		//* Add the member
		const member = { socketId, email };

		this.onlineMembers.push(member);

		return member;
	}
	addEmployee({ socketId, role }) {
		// Validate data
		if (!socketId || !role) {
			return null;
		}
		// Clean data
		// email = email.trim().toLowerCase();

		//? Check if already exists
		const existingEmployee = this.onlineEmployee.find(
			emoloyee => emoloyee.socketId === socketId,
		);

		if (existingEmployee) {
			return null;
		}

		//* Add the member
		const Employee = { socketId, role };

		this.onlineEmployee.push(Employee);

		return Employee;
	}

	/**
	 * Remove member from the list
	 * @param socketId
	 * @returns removed member if removed || null
	 */
	removeMember(socketId: string) {
		const index = this.onlineMembers.findIndex(
			member => member.socketId === socketId,
		);

		if (index !== -1) {
			return this.onlineMembers.splice(index, 1)[0];
		} else {
			return null;
		}
	}
	removeEmployee(socketId: string) {
		const index = this.onlineEmployee.findIndex(
			member => member.socketId === socketId,
		);

		if (index !== -1) {
			return this.onlineEmployee.splice(index, 1)[0];
		} else {
			return null;
		}
	}

	/**
	 * Get the socketId of the given member
	 * @param email Member email
	 * @returns member socketId
	 */
	getMemberSocketId(email: string) {
		const member = this.onlineMembers.find(member => member.email === email);
		return member?.socketId;
	}
	getEmployeeSocketId() {
		const member = this.onlineEmployee.map(data => data.socketId);
		return member;
	}
}
