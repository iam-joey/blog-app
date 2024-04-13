import { SignUp } from "@/components/SignUp";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "sonner";

async function page() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/");
  }
  return (
    <div className=" h-screen flex items-center justify-center">
      {" "}
      <SignUp />
    </div>
  );
}

export default page;
