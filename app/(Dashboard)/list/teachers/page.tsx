import FormContainer from "@/components/my/FormContainer";
import TableSearch from "@/components/my/TableSearch";
import Table from "@/components/my/Table";
import Pagination from "@/components/my/Pagination";
import prisma from "@/lib/prisma";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const columns = [
    {
      header: "Öğretmen Bilgileri",
      accessor: "info",
    },
    {
      header: "Öğretmen ID",
      accessor: "teacherId",
      className: "hidden md:table-cell",
    },
    {
      header: "İsim & Soyisim",
      accessor: "name & surname",
      className: "hidden md:table-cell",
    },
    {
      header: "Konular",
      accessor: "subjects",
      className: "hidden md:table-cell",
    },
    {
      header: "Sınıflar",
      accessor: "classes",
      className: "hidden md:table-cell",
    },
    {
      header: "Telefon",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Adres",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "İşlemler",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: TeacherList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img || "/noAvatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.username}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.id}</td>
      <td className="hidden md:table-cell">
        {item.name} {item.surname}
      </td>
      <td className="hidden md:table-cell">
        {item.subjects.map((subject) => subject.name).join(",")}
      </td>
      <td className="hidden md:table-cell">
        {item.classes.map((classItem) => classItem.name).join(",")}
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center sm:gap-2 lg:gap-4">
          <Link href={`/list/teachers/${item.id}`}>
            {/* XS Sonrası butonu */}
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky lg:hidden">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>

            {/* MD Sonrası butonu */}
            <Button
              variant={"default"}
              size={"sm"}
              className="hidden lg:block bg-cyan-700 dark:text-white dark:hover:text-black"
            >
              <div className="flex items-center gap-1">
                <UserCheck /> Görüntüle
              </div>
            </Button>
          </Link>

          {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <>
              <FormContainer table="teacher" type="update" data={item} />
              <FormContainer
                table="teacher"
                type="delete"
                id={item.id}
                data={item}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.TeacherWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lessons = {
              some: {
                classId: parseInt(value),
              },
            };
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({ where: query }),
  ]);

  return (
    <div className="baseContent p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Tüm Öğretmenler
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button> */}
            {role === "admin" && (
              <FormContainer table="teacher" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;
