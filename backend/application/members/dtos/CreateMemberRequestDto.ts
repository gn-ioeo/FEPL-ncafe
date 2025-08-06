export class CreateMemberRequestDto {
	constructor(
		public readonly username: string,
		public readonly email: string,
		public readonly password: string,
		public readonly phone?: string,
		public readonly profileImage?: string
	) {}
}
