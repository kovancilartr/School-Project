"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const Logo = () => {
  const { theme } = useTheme();

  return (
    <>
      {theme === "light" ? (
        <Image src="/logo2.svg" alt="logo" width={24} height={24} />
      ) : (
        <Image src="/logo2Dark.svg" alt="logo" width={24} height={24} />
      )}
    </>
  );
};

export default Logo;
