"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  parentSchema,
  ParentSchema,
  studentSchema,
  StudentSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createParent, updateParent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
// import { CldUploadWidget } from "next-cloudinary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const ParentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });

  const { toast } = useToast();
  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(
    type === "create" ? createParent : updateParent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log("ParentForm handleSubmit İçindekiler:", data);
    // Data'nın null olup olmadığını kontrol et
    if (!data) {
      console.error("Data is null or undefined");
      return; // Hata durumunda işlemi durdur
    }
    formAction({ ...data });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast({
        variant: "success",
        title: "İşlem başarılı...",
        description: `Veli kaydı başarı ile  ${
          type === "create" ? "oluşturuldu." : "güncellendi."
        }!`,
        duration: 5000,
      });
      setOpen(false);
      router.refresh();
    }
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Hata oluştu",
        description: "Bir hata meydana geldi!",
        duration: 5000,
      });
    }
  }, [state, router, type, setOpen]);

  const { students } = relatedData;

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-center">
        {type === "create" ? "Yeni Veli Kaydı" : "Veli Bilgilerini Güncelle"}
      </h1>
      <span className="text-xs mx-auto text-center text-gray-400 font-medium border-b w-1/2 pb-2">
        Giriş Bilgileri
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs mx-auto text-center text-gray-400 font-medium border-b w-1/2 pb-2">
        Kişisel Bilgiler
      </span>
      <div className="justify-between flex gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <label className="text-xs text-gray-500">Students</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
              >
                <div>{"Öğrenci Seç"}</div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
              <select
                multiple
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("students")}
                defaultValue={data?.students}
              >
                {students.map(
                  (student: { id: number; name: string; surname: string }) => (
                    <option value={student.id} key={student.id}>
                      {student.name} {student.surname}
                    </option>
                  )
                )}
              </select>
              {errors.students?.message && (
                <p className="text-xs text-red-400">
                  {errors.students.message.toString()}
                </p>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Oluştur" : "Güncelle"}
      </button>
    </form>
  );
};

export default ParentForm;
