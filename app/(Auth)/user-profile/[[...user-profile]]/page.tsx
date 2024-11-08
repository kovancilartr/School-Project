import { UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowDownLeftFromCircle } from "lucide-react";
import Link from "next/link";

const UserProfilePage = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role;
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <UserProfile path="/user-profile" />
      <Link href={(`/` + role) as string} className="flex flex-row gap-2 my-2">
        <ArrowDownLeftFromCircle className="text-gray-500 text-md" />
        Geri dön
      </Link>
    </div>
  );
};

export default UserProfilePage;
