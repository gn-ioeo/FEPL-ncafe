"use client";
import Input from "@/app/components/Input";
import styles from "./FilterForm.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

const {
  ["menu-filter-box"]: menuFilterBox,
  ["search-form"]: searchForm,
  ["category-menu"]: categoryMenu,
  ["category-list"]: categoryList,
  active,
} = styles;

const FilterForm = () => {
  const router = useRouter();
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("q");
    router.push(`/menus?q=${query}`);
  };

  return (
    <div className={menuFilterBox}>
      <section className={searchForm}>
        <h1 className="d:none">Menu Filter Panel</h1>
        <h2>NCafe Menu</h2>
        <form onSubmit={handleSubmit}>
          <Input />
          <button type="submit" className="n-icon n-icon:search">
            검색
          </button>
        </form>
      </section>
      <section className={categoryMenu}>
        <h1>카테고리 메뉴</h1>
        <ul className={categoryList}>
          <li className={active}>
            <Link href="menus">전체</Link>
          </li>
          <li>
            <Link href="menus?c=1">카테고리A</Link>
          </li>
          <li>
            <Link href="menus?c=2">카테고리B</Link>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default FilterForm;
