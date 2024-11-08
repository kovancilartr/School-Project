import Announcements from "@/components/my/Announcements";
import BigCalendarContainer from "@/components/my/BigCalendarContainer";
import EventCalendar from "@/components/my/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentPage = async () => {
  const { userId } = await auth();

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: userId! } },
    },
  });

  console.log("Giriş Yapmış Öğrenci Sınıf Verisi :" , classItem);
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full border drop-shadow-lg rounded-lg xl:w-3/4">
        <div className="h-full bg-white p-4 rounded-lg">
          <h1 className="text-lg font-semibold">
            <span className="text-red-600 text-2xl">{classItem[0].name}</span>{" "}
            Sınıfının Schedule (Takvimi)
          </h1>
          <BigCalendarContainer type="classId" id={classItem[0].id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/4 flex flex-col gap-8 drop-shadow-lg">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
