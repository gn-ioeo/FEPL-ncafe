export class LoginRequestDto {
	constructor(
		public readonly username: string,
		public readonly password: string
	) {}
}
