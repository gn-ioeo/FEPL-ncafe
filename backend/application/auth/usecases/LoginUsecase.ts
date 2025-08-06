import { LoginRequestDto } from "../dtos/LoginRequestDto";
import { LoginResponseDto } from "../dtos/LoginResponseDto";
import { MemberRepository } from "@/backend/domain/repositories/MemberRepository";
import bcrypt from "bcryptjs";

export class LoginUsecase {
	constructor(private memberRepository: MemberRepository) {}

	async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
		try {
			console.log("🚀 LoginUsecase.execute 시작");
			console.log("📝 요청 데이터:", {
				username: request.username,
				password: "***",
			});

			// bcryptjs 테스트
			console.log("🧪 bcryptjs 테스트 시작");
			const testHash = await bcrypt.hash("111", 12);
			const testCompare = await bcrypt.compare("111", testHash);
			console.log("🧪 테스트 해시:", testHash);
			console.log("🧪 테스트 비교 결과:", testCompare);

			// 사용자명으로 회원 조회
			const member = await this.memberRepository.findByUsername(
				request.username
			);

			console.log("👤 조회된 회원:", member ? "존재" : "없음");

			if (!member) {
				console.log("❌ 회원을 찾을 수 없음");
				return new LoginResponseDto(
					false,
					undefined,
					"사용자를 찾을 수 없습니다."
				);
			}

			console.log("🔐 비밀번호 검증 시작");
			console.log("📝 입력된 비밀번호:", request.password);
			console.log("🔒 저장된 해시:", member.password);

			// 임시: 평문 비밀번호 검증 (테스트용)
			if (member.password === request.password) {
				console.log("✅ 평문 비밀번호 일치 (임시)");
			} else {
				console.log("❌ 평문 비밀번호 불일치");
			}

			// bcryptjs를 사용한 비밀번호 검증
			const isPasswordValid = await bcrypt.compare(
				request.password,
				member.password || ""
			);

			console.log("✅ bcrypt.compare 결과:", isPasswordValid);

			// 임시: 평문 비밀번호도 허용 (테스트용)
			const finalPasswordValid =
				isPasswordValid || member.password === request.password;

			if (!finalPasswordValid) {
				console.log("❌ 비밀번호 불일치");
				return new LoginResponseDto(
					false,
					undefined,
					"비밀번호가 일치하지 않습니다."
				);
			}

			console.log("✅ 비밀번호 검증 성공");
			console.log("🎭 회원 역할 정보:", member.memberRoles);

			// 로그인 성공 시 회원 정보 반환
			const roles =
				member.memberRoles
					?.map((memberRole) => memberRole.role?.name)
					.filter((name): name is string => Boolean(name)) || [];

			console.log("🏷️ 추출된 역할:", roles);

			const response = new LoginResponseDto(true, {
				id: member.id,
				username: member.username,
				roles: roles,
			});

			console.log("🎉 로그인 성공 응답:", JSON.stringify(response, null, 2));
			return response;
		} catch (error) {
			console.error("💥 로그인 처리 중 오류 발생:", error);
			return new LoginResponseDto(
				false,
				undefined,
				"로그인 처리 중 오류가 발생했습니다."
			);
		}
	}
}
