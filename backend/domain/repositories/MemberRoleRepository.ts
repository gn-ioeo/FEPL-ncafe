import { MemberRole } from "../entities/MemberRole";

export interface MemberRoleRepository {
	save(memberRole: MemberRole): Promise<MemberRole>;
	findByMemberId(memberId: string): Promise<MemberRole[]>;
	deleteByMemberId(memberId: string): Promise<void>;
}
