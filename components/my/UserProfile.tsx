"use client"; // İstemci bileşeni olarak tanımlama
import React from "react";
import { useAuthContext } from "../../app/authProvider";

const UserProfile: React.FC = () => {
  const { currentUser, loading } = useAuthContext();

  if (loading) {
    return <div>Yükleniyor...</div>; // Yüklenme durumu
  }

  if (!currentUser) {
    return <div>Kullanıcı oturumu açmamış.</div>; // Kullanıcı yoksa
  }

  console.log("Current User: ", currentUser);
  return (
    <div>
      <h1>Kullanıcı Profili</h1>
      <p>Ad: {currentUser?.firstName}</p>
      <p>Soyad: {currentUser?.lastName}</p>
      <p>Rol: {currentUser?.publicMetadata.role}</p>
    </div>
  );
};

export default UserProfile;
