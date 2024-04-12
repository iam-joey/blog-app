"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MutableRefObject, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SignUp() {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const router = useRouter();
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    ref: MutableRefObject<string>
  ) => {
    ref.current = event.target.value;
  };

  const handlerSubmit = async () => {
    try {
      const email = emailRef.current.trim();
      const name = nameRef.current.trim();

      if (name.length < 1 || email.length < 1) {
        toast.error("Fill the details");
        return;
      }

      const data = {
        email,
        name,
      };
      const res = await axios.post(
        "https://backend.yerradarwin.workers.dev/auth/v1/user/signup",
        data
      );
      if (res.status == 201) {
        toast.success("You've Successfully Signed Up");
        router.push("/signin");
      }
    } catch (error: any) {
      console.log(error);
      if (error.name == "AxiosError") {
        toast.info(error.response.data.msg);
        return;
      }
      toast.error("something went wrong");
    }
  };
  return (
    <div className="">
      <Card className="mx-auto max-w-[1500px] px-11 py-6 shadow-md rounded-lg">
        <CardHeader className="flex flex-col gap-2 my-3">
          <CardTitle className="text-xl  uppercase text-center">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid">
              <div className="">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  onChange={(e) => handleInputChange(e, nameRef)}
                  id="first-name"
                  placeholder="Enter Your name"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => handleInputChange(e, emailRef)}
              />
            </div>
            <Button onClick={handlerSubmit} className="w-full">
              Create an account
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with GitHub
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
