import Logo from "@/components/my/Logo";
import Menu from "@/components/my/Menu";
import Navbar from "@/components/my/Navbar";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 leftMenuBg">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 lg:hover:scale-110 transition-all duration-300"
        >
          <Logo />
          <h1 className="hidden lg:block font-bold text-2xl">Matematiks</h1>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll flex flex-col rightDivBg">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
