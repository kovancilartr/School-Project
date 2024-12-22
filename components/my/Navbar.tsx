import { SignOutButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { ModeToggle } from "../ModeToggle";
import {
  Megaphone,
  MessageCircle,
  MessageCircleMore,
  Table,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const Navbar = async () => {
  const user = await currentUser();
  const isDisabledMessage = true; // Butonun Disable durumunu kontrol eder.
  const isDisabledNotification = true; // Butonun Disable durumunu kontrol eder.
  console.log("NAVBAR :", user);
  return (
    <div className="flex items-center justify-between p-4">
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <ModeToggle />
        <div className="flex items-center justify-center relative group">
          <Button disabled={isDisabledMessage} variant="ghost" size="icon">
            <MessageCircle className="w-6 h-6" />
          </Button>
          {isDisabledMessage && (
            <span
              className="cursor-default absolute left-1/2 top-6 transform -translate-x-1/2 mt-2 w-max
             bg-red-600 text-white font-bold text-xs rounded py-1 px-2 
             opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Yapım Aşamasında
            </span>
          )}
        </div>
        <div className="flex items-center justify-center cursor-pointer relative">
          <div className="flex items-center justify-center relative group">
            <Button
              disabled={isDisabledNotification}
              variant="ghost"
              size="icon"
            >
              <Megaphone className="w-6 h-6" />
            </Button>
            {isDisabledNotification ? (
              <span
                className="cursor-default absolute left-1/2 top-6 transform -translate-x-1/2 mt-2 w-max
             bg-red-600 text-white font-bold text-xs rounded py-1 px-2 
             opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Yapım Aşamasında
              </span>
            ) : (
              <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
                1
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex flex-row items-center gap-1">
                <Image
                  src={`${user?.imageUrl}`}
                  alt=""
                  width={1080}
                  height={780}
                  className="rounded-full w-12 h-12 border-2 border-lamaYellow"
                />
                <div className="flex flex-col items-center">
                  <span className="text-xs leading-3 font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-[10px] text-black dark:text-white text-right">
                    {(user?.publicMetadata?.role as string) === "admin"
                      ? "Admin"
                      : (user?.publicMetadata?.role as string) === "teacher"
                      ? "Öğretmen"
                      : (user?.publicMetadata?.role as string) === "parent"
                      ? "Veli"
                      : "Öğrenci"}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-6">
              <DropdownMenuLabel className="flex flex-col items-center text-md">
                Hoş Geldin
                <span className="text-red-600" style={{ fontSize: "10px" }}>
                  {user?.id}
                </span>
                <span className="text-xs">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-green-700">
                  {(user?.publicMetadata?.role as string) === "admin"
                    ? "Admin"
                    : (user?.publicMetadata?.role as string) === "teacher"
                    ? "Öğretmen"
                    : (user?.publicMetadata?.role as string) === "parent"
                    ? "Veli"
                    : "Öğrenci"}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/auth/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <span className="hidden lg:block">Hesabımı Yönet</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  <span className="hidden lg:block">Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <SignOutButton>
                  <span className="hidden lg:block">Çıkış Yap</span>
                </SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/> */}
      </div>
    </div>
  );
};

export default Navbar;
