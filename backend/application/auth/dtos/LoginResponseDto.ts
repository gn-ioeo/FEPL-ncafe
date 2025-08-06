export class LoginResponseDto {
	constructor(
		public readonly success: boolean,
		public readonly member?: {
			id: string;
			username: string;
			roles: string[];
		},
		public readonly message?: string
	) {}
}
