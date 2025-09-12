import Image from "next/image";
import { BeakerIcon } from '@heroicons/react/24/solid'
import { NavBar } from "@/components/tree-project/nav-bar";


export default function Home() {
  return (
    <div>
    <NavBar />
      <BeakerIcon className="size-6 text-slate-200-500" />

    </div>
  );
}
