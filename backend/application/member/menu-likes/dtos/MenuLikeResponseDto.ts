export class MenuLikeResponseDto {
	constructor(
		public success: boolean,
		public message: string,
		public likeCount?: number,
		public isLiked?: boolean
	) {}
}
