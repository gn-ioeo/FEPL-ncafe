import { CreateMemberRequestDto } from "../dtos/CreateMemberRequestDto";
import { CreateMemberResponseDto } from "../dtos/CreateMemberResponseDto";
import { MemberRepository } from "@/backend/domain/repositories/MemberRepository";
import { MemberRoleRepository } from "@/backend/domain/repositories/MemberRoleRepository";
import { Member } from "@/backend/domain/entities/Member";
import { MemberRole } from "@/backend/domain/entities/MemberRole";
import bcrypt from "bcryptjs";

export class CreateMemberUsecase {
	constructor(
		private memberRepository: MemberRepository,
		private memberRoleRepository: MemberRoleRepository
	) {}

	async execute(
		request: CreateMemberRequestDto
	): Promise<CreateMemberResponseDto> {
		try {
			console.log("🚀 CreateMemberUsecase.execute 시작");
			console.log("📝 요청 데이터:", {
				username: request.username,
				email: request.email,
				password: "***",
			});

			// 1. 비밀번호 해시화
			const hashedPassword = await bcrypt.hash(request.password, 12);
			console.log("🔐 비밀번호 해시화 완료");

			// 2. Member 엔티티 생성
			const member = new Member(
				"", // id는 DB에서 자동 생성
				request.email,
				request.username,
				request.phone,
				new Date(), // createdAt
				new Date(), // updatedAt
				null, // deletedAt
				hashedPassword,
				request.profileImage
			);

			// 3. Member 저장
			const savedMember = await this.memberRepository.save(member);
			console.log("👤 회원 저장 완료:", savedMember.id);

			// 4. 기본 역할 (MEMBER) 추가
			const memberRole = new MemberRole(
				savedMember.id,
				2, // role_id 2 = MEMBER
				new Date()
			);

			// 5. MemberRole 저장
			await this.memberRoleRepository.save(memberRole);
			console.log("🎭 회원 역할 저장 완료");

			// 6. 저장된 회원의 역할 조회
			const memberRoles = await this.memberRoleRepository.findByMemberId(
				savedMember.id
			);
			const roles = memberRoles.map((mr) => {
				// role_id 1 = ADMIN, role_id 2 = MEMBER
				return mr.roleId === 1 ? "ADMIN" : "MEMBER";
			});

			console.log("🏷️ 회원 역할:", roles);

			const response = new CreateMemberResponseDto(true, {
				id: savedMember.id,
				username: savedMember.username,
				email: savedMember.email,
				roles: roles,
			});

			console.log("🎉 회원가입 성공:", JSON.stringify(response, null, 2));
			return response;
		} catch (error) {
			console.error("💥 회원가입 처리 중 오류 발생:", error);
			return new CreateMemberResponseDto(
				false,
				undefined,
				"회원가입 처리 중 오류가 발생했습니다."
			);
		}
	}
}
