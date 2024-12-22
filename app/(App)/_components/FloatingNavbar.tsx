"use client";
import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SignInButton, SignInWithMetamaskButton, SignOutButton, useAuth, useClerk } from "@clerk/nextjs";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    key: string;
    items: {
      name: string;
      link: string;
      icon?: JSX.Element;
    }[];
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();

  // set true for the initial state so that nav bar is visible in the hero section
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        // also set true for the initial state
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  const role = useClerk().user?.publicMetadata.role as string;
  const [filteredNavItems, setFilteredNavItems] = useState<
    { name: string; link: string; icon?: JSX.Element }[]
  >([]);

  useEffect(() => {
    // Rol bazlı menü öğelerini filtrele
    const items =
      (navItems.find((item) => item.key === role)?.items as {
        name: string;
        link: string;
        icon?: JSX.Element;
      }[]) ||
      (navItems.find((item) => item.key === "quest")?.items as {
        name: string;
        link: string;
        icon?: JSX.Element;
      }[]) ||
      []; // key eşleşmiyorsa "quest" olan menüyü göster
    setFilteredNavItems(items);
  }, [role, navItems]); // role ve navItems değiştiğinde çalışacak

  const { sessionId } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          // change rounded-full to rounded-lg
          // remove dark:border-white/[0.2] dark:bg-black bg-white border-transparent
          // change  pr-2 pl-8 py-2 to px-10 py-5
          "flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-[5000] top-10 inset-x-0 mx-auto px-10 py-5 rounded-lg border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-center space-x-4",
          className
        )}
        style={{
          backdropFilter: "blur(16px) saturate(180%)",
          backgroundColor: "rgba(17, 25, 40, 0.75)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.125)",
        }}
      >
        {filteredNavItems.map(
          (
            navItem: { name: string; link: string; icon?: JSX.Element }, // Türü belirtildi
            idx: number // idx parametresine tür belirtildi
          ) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                "relative dark:text-white items-center flex space-x-1 text-white  transition-all duration-300 transform hover:scale-110 hover:rotate-6 hover:dark:text-red-500 hover:text-red-500"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="text-sm !cursor-pointer">{navItem.name}</span>
            </Link>
          )
        )}
        {sessionId ? (
          <div className="relative dark:text-white items-center flex space-x-1 text-white  transition-all duration-300 transform hover:scale-110 hover:rotate-6 hover:dark:text-red-500 hover:text-red-500">
            <SignOutButton>
              <span className="text-sm !cursor-pointer">Çıkış Yap</span>
            </SignOutButton>
          </div>
        ) : (
          <div className="relative dark:text-white items-center flex space-x-1 text-white  transition-all duration-300 transform hover:scale-110 hover:rotate-6 hover:dark:text-red-500 hover:text-red-500">
            <SignInButton>
              <span className="text-sm !cursor-pointer">Giriş Yap</span>
            </SignInButton>
          </div>
        )}

        {/* remove this login btn */}
        {/* <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
        </button> */}
      </motion.div>
    </AnimatePresence>
  );
};
