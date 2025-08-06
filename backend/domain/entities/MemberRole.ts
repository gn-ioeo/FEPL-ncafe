import { Member } from "./Member";
import { Role } from "./Role";

export class MemberRole {
	constructor(
		public memberId: string,
		public roleId: number,
		public createdAt: Date,
		public member?: Member,
		public role?: Role
	) {}
}
