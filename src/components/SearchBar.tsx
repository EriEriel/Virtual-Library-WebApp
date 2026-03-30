"use client";

export function SearchBar() {
  return (
    <form method="get" action="/">
      <input
        name="search"
        placeholder="Search Entry"
        className="border border-white bg-white rounded p-2 w-64 h-10"
      />
    </form>
  )
}
