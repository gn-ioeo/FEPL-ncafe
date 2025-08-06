export class CreateMemberResponseDto {
	constructor(
		public readonly success: boolean,
		public readonly member?: {
			id: string;
			username: string;
			email: string;
			roles: string[];
		},
		public readonly message?: string
	) {}
}
