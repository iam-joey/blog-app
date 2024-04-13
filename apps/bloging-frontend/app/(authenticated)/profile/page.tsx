import Account from "@/components/Account";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session: any = await getServerSession(authOptions);
  if (!session.jwtToken) {
    redirect("/");
  }
  return (
    <div className="border h-full flex justify-center items-center">
      <Account jwtToken={session!.jwtToken} />
    </div>
  );
}

export default page;
