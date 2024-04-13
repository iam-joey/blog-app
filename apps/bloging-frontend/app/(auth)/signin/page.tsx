import { SignIn } from "@/components/SignIn";
import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/authOptions";
import { redirect } from "next/navigation";

async function page() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/");
  }
  return (
    <div className=" h-screen  flex items-center justify-center">
      <SignIn />
    </div>
  );
}

export default page;
