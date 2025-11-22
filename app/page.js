import Image from "next/image";
import Link from "next/link";
// import { useState } from "react";

export default function Home() {
  // const totalItem = 100;
  // const itemPerPage = 10;
  // const [currentPage, setcurrentPage] = useState(1)
  // let startIndex = (currentPage - 1) * pageSize;
  // endindex = startIndex + itemPerPage
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href="/NextJS_FormBuilder_Editable">
        Go to Form Builder
      </Link>
    </div>
  );
}
