import Image from "next/image";
import Link from "next/link";
// import { useState } from "react";

export default function Home() {
 
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href="/NextJS_FormBuilder_Editable">
        Go to Form Builder
      </Link>
    </div>
  );
}
