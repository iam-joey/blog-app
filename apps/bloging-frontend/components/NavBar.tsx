"use client";
import React from "react";
import Logo from "./Icons/Logo";
import Profile from "./Profile";
import { Input } from "./ui/input";
import Link from "next/link";

export function NavBar() {
  return (
    <div className=" h-full items-center p-5 flex justify-between">
      <h1 className="text-4xl hover:cursor-pointer flex items-center">
        <Link className="flex items-center gap-2 h-full" href="/">
          {" "}
          <Logo />
          <span className="text-sm">Blogs</span>
        </Link>
      </h1>
      <div className="hidden md:block">
        <Input placeholder="Search...." />
      </div>
      <div className="hidden p-2 md:flex gap-3 items-center">
        <Profile />
      </div>
      <div className="md:hidden">
        <Profile />
      </div>
    </div>
  );
}
