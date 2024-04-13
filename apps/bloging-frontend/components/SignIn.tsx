"use client";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MutableRefObject, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SignIn() {
  const emailRef = useRef<string>("");
  const router = useRouter();
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    ref: MutableRefObject<string>
  ) => {
    ref.current = event.target.value;
  };

  const handleSubmit = async () => {
    try {
      console.log(emailRef.current);

      if (emailRef.current.length < 1) {
        toast.error("Email field is empty");
        return;
      }
      const res = await signIn("credentials", {
        email: emailRef.current,
        redirect: false,
      });
      if (!res?.ok) {
        toast.error(res?.error);
        return;
      }
      toast.success("Sucessfully logged in");
      router.push("/");
    } catch (error: any) {
      console.log(error);
      toast.error("something went wrong");
    }
  };
  return (
    <div className="w-full  lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
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
            <Button onClick={handleSubmit} className="w-full ">
              Login
            </Button>
            <Button variant="outline" className="w-full p-2">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block border border-black">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
