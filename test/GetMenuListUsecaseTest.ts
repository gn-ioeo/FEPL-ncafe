import { GetMenuListUsecase } from "@/backend/application/menes/usecases/GetMenuListUsecase";
import { PrMenuRepository } from "@/backend/infrastructure/repositories/PrMenuRepository";
import { GetMenuListQueryDto } from "@/backend/application/menes/dtos/GetMenuListQueryDto";

// Mock 데이터 생성 함수
function createMockQuery(
  overrides: Partial<GetMenuListQueryDto> = {}
): GetMenuListQueryDto {
  return {
    categoryId: 1,
    pageNum: 0,
    query: "",
    ...overrides,
  };
}

async function testGetMenuListUsecase() {
  console.log("🧪 GetMenuListUsecase 테스트 시작");

  try {
    // Repository 인스턴스 생성
    const menuRepository = new PrMenuRepository();
    const usecase = new GetMenuListUsecase(menuRepository);

    // 테스트 케이스 1: 기본 메뉴 목록 조회
    console.log("\n📋 테스트 1: 기본 메뉴 목록 조회");
    const basicQuery = createMockQuery();
    const basicResult = await usecase.execute(basicQuery);

    console.log("✅ 결과:", {
      메뉴수: basicResult.menus.length,
      마지막페이지: basicResult.endPage,
      첫번째메뉴: basicResult.menus[0]
        ? {
            id: basicResult.menus[0].id,
            korName: basicResult.menus[0].korName,
            price: basicResult.menus[0].price,
          }
        : "메뉴 없음",
    });

    // 테스트 케이스 2: 검색어가 있는 경우
    console.log("\n🔍 테스트 2: 검색어로 메뉴 검색");
    const searchQuery = createMockQuery({ query: "아메리카노" });
    const searchResult = await usecase.execute(searchQuery);

    console.log("✅ 검색 결과:", {
      검색어: searchQuery.query,
      메뉴수: searchResult.menus.length,
      검색된메뉴들: searchResult.menus.map((menu) => menu.korName),
    });

    // 테스트 케이스 3: 카테고리별 조회
    console.log("\n🏷️ 테스트 3: 카테고리별 메뉴 조회");
    const categoryQuery = createMockQuery({ categoryId: 2 });
    const categoryResult = await usecase.execute(categoryQuery);

    console.log("✅ 카테고리 결과:", {
      카테고리ID: categoryQuery.categoryId,
      메뉴수: categoryResult.menus.length,
      카테고리메뉴들: categoryResult.menus.map((menu) => menu.korName),
    });

    // 테스트 케이스 4: 페이지네이션
    console.log("\n📄 테스트 4: 페이지네이션");
    const pageQuery = createMockQuery({ pageNum: 10 });
    const pageResult = await usecase.execute(pageQuery);

    console.log("✅ 페이지네이션 결과:", {
      페이지번호: pageQuery.pageNum,
      메뉴수: pageResult.menus.length,
      마지막페이지: pageResult.endPage,
    });

    // 테스트 케이스 5: DTO 변환 검증
    console.log("\n🔄 테스트 5: DTO 변환 검증");
    if (basicResult.menus.length > 0) {
      const firstMenu = basicResult.menus[0];
      const requiredFields = [
        "id",
        "korName",
        "engName",
        "price",
        "description",
        "defaultImage",
      ];
      const missingFields = requiredFields.filter(
        (field) => !(field in firstMenu)
      );

      if (missingFields.length === 0) {
        console.log("✅ DTO 변환 성공: 모든 필수 필드 존재");
        console.log("   필드 값:", {
          id: firstMenu.id,
          korName: firstMenu.korName,
          engName: firstMenu.engName,
          price: firstMenu.price,
          description: firstMenu.description?.substring(0, 30) + "...",
          defaultImage: firstMenu.defaultImage,
        });
      } else {
        console.log("❌ DTO 변환 실패: 누락된 필드들:", missingFields);
      }
    }

    console.log("\n🎉 모든 테스트 완료!");
  } catch (error) {
    console.error("\n❌ 테스트 실행 중 오류 발생:");
    if (error instanceof Error) {
      console.error("에러 메시지:", error.message);
      console.error("스택 트레이스:", error.stack);
    } else {
      console.error("알 수 없는 에러:", error);
    }
  }
}

// 개별 함수들도 테스트할 수 있도록 export
export { testGetMenuListUsecase, createMockQuery };

// 직접 실행하는 경우
if (require.main === module) {
  testGetMenuListUsecase().finally(() => {
    console.log("\n🏁 테스트 프로그램 종료");
    process.exit(0);
  });
}
