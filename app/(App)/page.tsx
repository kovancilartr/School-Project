import Link from "next/link";
import React from "react";
import { FloatingNav } from "./_components/FloatingNavbar";
import { navItems } from "@/lib/data";
import Hero from "./_components/sectionComponents/Hero";
import RecentProjects from "./_components/sectionComponents/RecentProjects";
import Footer from "./_components/sectionComponents/Footer";
import Clients from "./_components/sectionComponents/Clients";

const AppPage = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <RecentProjects />
        <Clients />
        <Footer />
      </div>
    </main>
  );
};

export default AppPage;
