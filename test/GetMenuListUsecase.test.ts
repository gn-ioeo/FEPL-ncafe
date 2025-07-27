import { GetMenuListUsecase } from "@/backend/application/menes/usecases/GetMenuListUsecase";
import { MenuRepository } from "@/backend/domain/repositories/MenuRepository";
import { Menu } from "@/backend/domain/entities/Menu";
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

describe("GetMenuListUsecase", () => {
  let usecase: GetMenuListUsecase;
  let mockRepository: MockMenuRepository;

  // 간단한 Mock Repository 클래스
  class MockMenuRepository implements MenuRepository {
    private mockData: Menu[] = [];
    private mockError: Error | null = null;

    // Mock 데이터 설정
    setMockData(data: Menu[]) {
      this.mockData = data;
    }

    // Mock 에러 설정
    setMockError(error: Error) {
      this.mockError = error;
    }

    async findAll(): Promise<Menu[]> {
      if (this.mockError) {
        throw this.mockError;
      }
      return this.mockData;
    }

    async findById(): Promise<Menu | null> {
      return null;
    }

    async count(): Promise<number> {
      return this.mockData.length;
    }

    async save(): Promise<Menu> {
      throw new Error("Not implemented");
    }

    async update(): Promise<Menu> {
      throw new Error("Not implemented");
    }

    async delete(): Promise<void> {
      // 구현 없음
    }
  }

  beforeEach(() => {
    mockRepository = new MockMenuRepository();
    usecase = new GetMenuListUsecase(mockRepository);
  });

  describe("execute", () => {
    it("기본 메뉴 목록을 조회해야 한다", async () => {
      // Given (준비) - Mock 데이터 설정
      const mockMenus = [
        new Menu(
          1,
          "아메리카노",
          "Americano",
          4500,
          "user1",
          1,
          false,
          new Date(),
          true
        ),
        new Menu(
          2,
          "카페라떼",
          "Cafe Latte",
          5000,
          "user1",
          1,
          false,
          new Date(),
          true
        ),
      ];
      mockRepository.setMockData(mockMenus);

      // When (실행) - 실제 테스트할 기능 실행
      const result = await usecase.execute({
        categoryId: 1,
        pageNum: 0,
        query: "",
      });

      // Then (검증) - 결과 확인
      assert.strictEqual(result.menus.length, 2, "메뉴 개수가 2개여야 함");
      assert.strictEqual(
        result.menus[0].korName,
        "아메리카노",
        "첫 번째 메뉴 이름 확인"
      );
      assert.strictEqual(
        result.menus[1].korName,
        "카페라떼",
        "두 번째 메뉴 이름 확인"
      );
      assert.strictEqual(result.endPage, 1, "총 페이지 수가 1이어야 함"); // Math.ceil(2/10) = 1

      console.log("기본 메뉴 목록 조회 테스트 통과");
    });

    it("빈 결과일 때 빈 배열을 반환해야 한다", async () => {
      // Given
      mockRepository.setMockData([]);

      // When
      const result = await usecase.execute({
        categoryId: 999,
        pageNum: 0,
        query: "",
      });

      // Then
      assert.strictEqual(result.menus.length, 0, "빈 배열이어야 함");
      assert.strictEqual(result.endPage, 0, "페이지 수가 0이어야 함");

      console.log("빈 결과 테스트 통과");
    });

    it("Repository에서 에러가 발생하면 에러를 전파해야 한다", async () => {
      // Given
      const error = new Error("Database connection failed");
      mockRepository.setMockError(error);

      // When & Then
      try {
        await usecase.execute({
          categoryId: 1,
          pageNum: 0,
          query: "",
        });
        assert.fail("에러가 발생해야 하는데 발생하지 않음");
      } catch (err) {
        assert.strictEqual(
          (err as Error).message,
          "Database connection failed",
          "에러 메시지가 올바르게 전파되어야 함"
        );
        console.log("에러 전파 테스트 통과");
      }
    });

    it("페이지네이션이 올바르게 계산되어야 한다", async () => {
      // Given - 25개 메뉴 (3페이지)
      const mockMenus = Array.from(
        { length: 25 },
        (_, i) =>
          new Menu(i + 1, `메뉴${i + 1}`, `Menu${i + 1}`, 5000, "user1", 1)
      );
      mockRepository.setMockData(mockMenus);

      // When
      const result = await usecase.execute({
        categoryId: 1,
        pageNum: 0,
        query: "",
      });

      // Then
      assert.strictEqual(result.endPage, 3, "총 페이지 수가 3이어야 함"); // Math.ceil(25/10) = 3
      assert.strictEqual(result.menus.length, 25, "메뉴 개수가 25개여야 함");

      console.log("페이지네이션 계산 테스트 통과");
    });
  });
});
