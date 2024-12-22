import FormContainer from "@/components/my/FormContainer";
import TableSearch from "@/components/my/TableSearch";
import Table from "@/components/my/Table";
import Pagination from "@/components/my/Pagination";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";

type StudentList = Student & { class: Class };

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const loggedInUser = await currentUser();
  const role = (loggedInUser?.publicMetadata as { role?: string })?.role;
  const columns = [
    {
      header: "Öğrenci Bilgileri",
      accessor: "info",
    },
    {
      header: "Öğrenci ID",
      accessor: "studentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Seviye",
      accessor: "grade",
      className: "hidden md:table-cell",
    },
    {
      header: "Telefon Numarası",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Adres",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "İşlemler",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: StudentList) => (
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
          <h3 className="font-semibold">
            {item.name} {item.surname}
          </h3>
          <p className="text-xs text-gray-500">{item.class.name}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.id}</td>
      <td className="hidden md:table-cell">{item.class.name[0]}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center sm:gap-2 lg:gap-4">
          <Link href={`/list/students/${item.id}`}>
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
          {(role === "admin" || role === "teacher") && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>

            <>
              <FormContainer table="student" type="update" data={item} />
              <FormContainer
                table="student"
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

  const query: Prisma.StudentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.class = {
              lessons: {
                some: {
                  teacherId: value,
                },
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

  const [dataAllStudents, countAllStudents] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.student.count({ where: query }),
  ]);

  const teacherId = loggedInUser?.id; // Giriş yapmış öğretmen ID'sini al
  // Giriş Yapmış Öğretmen ID'sine göre sınıfları al
  const [dataTeacherStudents, countTeacherStudents] = await prisma.$transaction(
    [
      prisma.student.findMany({
        where: {
          class: {
            supervisorId: teacherId, // supervisorId ile teacherId'yi eşleştir
          },
        },
        include: {
          class: true,
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.student.count({
        where: {
          class: {
            supervisorId: teacherId, // supervisorId ile teacherId'yi eşleştir
          },
        },
      }),
    ]
  );

  return (
    <div className="baseContent p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          {role === "admin" ? "Tüm Öğrenci Listesi" : `Öğrenci Listeniz`}
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
              <FormContainer table="student" type="create" />
            )}
          </div>
        </div>
      </div>
      {role === "admin" ? (
        <>
          <Table
            columns={columns}
            renderRow={renderRow}
            data={dataAllStudents}
          />
          <Pagination page={p} count={countAllStudents} />
        </>
      ) : (
        <>
          <Table
            columns={columns}
            renderRow={renderRow}
            data={dataTeacherStudents}
          />
          <Pagination page={p} count={countTeacherStudents} />
        </>
      )}
    </div>
  );
};

export default StudentListPage;
