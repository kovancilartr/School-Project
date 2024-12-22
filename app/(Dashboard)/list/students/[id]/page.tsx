import Announcements from "@/components/my/Announcements";
import BigCalendarContainer from "@/components/my/BigCalendarContainer";
import BigCalendar from "@/components/my/BigCalender";
import FormContainer from "@/components/my/FormContainer";
import Performance from "@/components/my/Performance";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const SingleStudentPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const user = await currentUser();

  const currentUserId = user?.id;
  const currentRole = user?.publicMetadata.role as string;
  const paramUserId = id;

  // Veritabanından öğrenci bilgilerini al
  const student = await prisma.student.findUnique({
    where: { id: id },
    include: {
      parent: true,
      class: {
        include: {
          supervisor: true,
        },
      },
    },
  });

  console.log("STUDENT :", student);
  if (!student) {
    // Eğer öğretmen bulunamazsa, uygun bir yanıt döndürün
    return <div>Öğretmen bulunamadı.</div>;
  }
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={student.img || "/Avatar.png"}
                alt=""
                width={1440}
                height={1440}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-2">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {student.name} {student.surname}
                </h1>
                {currentRole === "admin" && (
                  <FormContainer table="student" type="update" data={student} />
                )}
              </div>
              {/* SINIF Verileri */}
              <div className="border bg-white/30 border-black/30 p-2 rounded-lg drop-shadow-xl shadow-xl">
                <p className="text-xs text-gray-500">
                  <span className="font-bold text-red-700">Öğrenci ID:</span>{" "}
                  {student.id}
                  <br />
                  <span className="font-bold text-red-700">Sınıf:</span>{" "}
                  {student.class.name}
                  <br />
                  <span className="font-bold text-red-700">
                    Yetkili Öğretmen:
                  </span>{" "}
                  {student.class.supervisor?.name}{" "}
                  {student.class.supervisor?.surname}
                  <br />
                  <span className="font-bold text-red-700">
                    Öğrenci Velisi:
                  </span>{" "}
                  {student.parent.name} {student.parent.surname}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>
                    {" "}
                    {student.birthday
                      ? new Date(student.birthday).toLocaleDateString("tr-TR")
                      : ""}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.gradeId}</h1>
                <span className="text-sm text-gray-400">Seviye</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">18</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Sınıf</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendarContainer type="teacherId" id={id!} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold text-center">
            İlgili Bağlantılar
          </h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500 items-center justify-center">
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/lessons?classId=${student.classId}`}
            >
              Student&apos;s Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaPurpleLight"
              href={`/list/teachers?classId=${student.classId}`}
            >
              Student&apos;s Teachers
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?classId=${student.classId}`}
            >
              Student&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/assignments?classId=${student.classId}`}
            >
              Student&apos;s Assignments
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaYellowLight"
              href={`/list/results?studentId=${student.id}`}
            >
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
