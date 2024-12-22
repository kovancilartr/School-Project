import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  const menuItems = [
    {
      title: "Menü",
      key: "menu",
      items: [
        {
          icon: "/teacher.png",
          label: "Eğitim Paneli",
          href: `/${role}`,
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/profile.png",
          label: "Öğretmenler",
          href: "/list/teachers",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/student.png",
          label: "Öğrenciler",
          href: "/list/students",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/parent.png",
          label: "Veliler",
          href: "/list/parents",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/class.png",
          label: "Sınıflar",
          href: "/list/classes",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/lesson.png",
          label: "Dersler",
          href: "/list/lessons",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/exam.png",
          label: "Sınavlar",
          href: "/list/exams",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/assignment.png",
          label: "Görevler",
          href: "/list/assignments",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/attendance.png",
          label: "Sonuçlar",
          href: "/list/results",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/calendar.png",
          label: "Etkinlikler",
          href: "/list/events",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/attendance.png",
          label: "Subjects",
          href: "/list/subjects",
          visible: ["admin"],
        },
        {
          icon: "/attendance.png",
          label: "Katılım",
          href: "/list/attendance",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
    {
      title: " ",
      key: "other",
      items: [
        {
          icon: "/home.png",
          label: "Ana Sayfa",
          href: "/",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/profile.png",
          label: "Profile",
          href: "/auth/profile",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/message.png",
          label: "Mesajlar",
          href: "/list/messages",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/announcement.png",
          label: "Duyurular",
          href: "/list/announcements",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/setting.png",
          label: "Settings",
          href: "/settings",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
  ];

  return (
    <div className="mt-4 text-sm ">
      <div className="flex flex-col justify-between">
        {menuItems
          .filter((i) => i.key === "menu")
          .map((i) => (
            <div className="flex flex-col gap-2" key={i.title}>
              <span className="hidden lg:block text-center font-light my-2 border-b border-gray-100 baseText">
                {i.title}
              </span>
              {i.items.map((item) => {
                if (item.visible.includes(role)) {
                  return (
                    <Link
                      href={item.href}
                      key={item.label}
                      className="flex items-center justify-center lg:justify-start gap-4 baseText py-2 md:px-2 rounded-md hover:bg-lamaSkyLight hover:text-black"
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="invert"
                      />
                      <span className="hidden lg:block">{item.label}</span>
                    </Link>
                  );
                }
              })}
            </div>
          ))}
        {menuItems
          .filter((i) => i.key === "other")
          .map((i) => (
            <div className="flex flex-col gap-2" key={i.title}>
              <span className="hidden lg:block text-center baseText font-light my-2">
                {i.title}
              </span>
              {i.items.map((item) => {
                if (item.visible.includes(role)) {
                  return (
                    <Link
                      href={item.href}
                      key={item.label}
                      className="flex items-center justify-center lg:justify-start gap-4 baseText py-2 md:px-2 rounded-md hover:bg-lamaSkyLight hover:text-black"
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="invert"
                      />
                      <span className="hidden lg:block">{item.label}</span>
                    </Link>
                  );
                }
              })}
            </div>
          ))}
        <SignOutButton>
          <div className="flex  justify-center lg:justify-start gap-4 baseText py-2 md:px-2 rounded-md hover:bg-lamaSkyLight hover:text-black cursor-pointer my-2">
            <Image
              src="/logout.png"
              alt=""
              width={20}
              height={20}
              className="invert"
            />
            <span className="hidden lg:block">Çıkış Yap</span>
          </div>
        </SignOutButton>
      </div>
    </div>
  );
};

export default Menu;
