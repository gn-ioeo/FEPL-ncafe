import { MemberRepository } from "@/backend/domain/repositories/MemberRepository";
import { MemberRoleRepository } from "@/backend/domain/repositories/MemberRoleRepository";
import { Member } from "@/backend/domain/entities/Member";
import { MemberRole } from "@/backend/domain/entities/MemberRole";

export interface GoogleUserInfo {
	id: string;
	email: string;
	name?: string;
	picture?: string;
}

export class GoogleLoginUsecase {
	constructor(
		private memberRepository: MemberRepository,
		private memberRoleRepository: MemberRoleRepository
	) {}

	async execute(googleUser: GoogleUserInfo): Promise<{
		success: boolean;
		member?: {
			id: string;
			username?: string;
			email: string;
			roles: string[];
		};
		message?: string;
	}> {
		try {
			console.log("🚀 GoogleLoginUsecase.execute 시작");
			console.log("📝 구글 사용자 정보:", {
				id: googleUser.id,
				email: googleUser.email,
				name: googleUser.name,
			});

			// 1. 이메일로 기존 회원 찾기
			const existingMember = await this.memberRepository.findByEmail(
				googleUser.email
			);

			if (existingMember) {
				console.log("👤 기존 회원 발견:", existingMember.id);

				// 기존 회원의 역할 조회
				const memberRoles = await this.memberRoleRepository.findByMemberId(
					existingMember.id
				);
				const roles = memberRoles.map((mr) => {
					return mr.roleId === 1 ? "ADMIN" : "MEMBER";
				});

				console.log("🏷️ 기존 회원 역할:", roles);

				return {
					success: true,
					member: {
						id: existingMember.id,
						username: existingMember.username || undefined,
						email: existingMember.email,
						roles: roles,
					},
				};
			}

			// 2. 신규 회원 생성
			console.log("🆕 신규 구글 회원 생성 시작");

			const newMember = new Member(
				"", // id는 DB에서 자동 생성
				googleUser.email,
				googleUser.name || undefined, // username을 구글 이름으로 설정
				undefined, // phone
				new Date(), // createdAt
				new Date(), // updatedAt
				undefined, // deletedAt
				undefined, // password (구글 로그인은 비밀번호 없음)
				googleUser.picture || undefined, // profileImage
				"google", // provider
				googleUser.id // providerId
			);

			// 3. 회원 저장
			const savedMember = await this.memberRepository.save(newMember);
			console.log("👤 신규 회원 저장 완료:", savedMember.id);

			// 4. 기본 역할 (MEMBER) 추가
			const memberRole = new MemberRole(
				savedMember.id,
				2, // role_id 2 = MEMBER
				new Date()
			);

			await this.memberRoleRepository.save(memberRole);
			console.log("🎭 신규 회원 역할 저장 완료");

			console.log("🎉 구글 로그인 성공");
			return {
				success: true,
				member: {
					id: savedMember.id,
					username: savedMember.username || undefined,
					email: savedMember.email,
					roles: ["MEMBER"],
				},
			};
		} catch (error) {
			console.error("💥 구글 로그인 처리 중 오류 발생:", error);
			return {
				success: false,
				message: "구글 로그인 처리 중 오류가 발생했습니다.",
			};
		}
	}
}
