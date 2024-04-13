"use client";
import { userData } from "@/app/store/atoms/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

export default function Account({ jwtToken }: { jwtToken: string }) {
  const [user, setUser] = useRecoilState(userData(jwtToken));
  const nameRef = useRef(user.name || "");
  const emailRef = useRef(user.email || "");
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    nameRef.current = event.target.value;
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    emailRef.current = event.target.value;
  };

  const handleSubmit = async () => {
    try {
      if (nameRef.current.length < 1 || emailRef.current.length < 1) {
        toast.warning("Enter correct fields");
        return;
      }
      console.log(jwtToken);
      const updatedData: {
        name?: string;
        email?: string;
      } = {}; // Object to store changed data

      if (nameRef.current !== user.name) {
        updatedData.name = nameRef.current.trim();
      }

      if (emailRef.current !== user.email) {
        updatedData.email = emailRef.current.trim();
      }
      console.log(updatedData);
      if (Object.keys(updatedData).length === 0) {
        toast.info("No changes to update");
        return;
      }

      const res = await axios.post(
        "https://backend.yerradarwin.workers.dev/api/v1/auth/user/update",
        updatedData,
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      if (res.status === 201) {
        setUser({
          ...user,
          ...updatedData, // Update state with only changed data
        });
        toast.success("Updated Successfully");
      }
    } catch (error: any) {
      console.log(error);
      if (error.name === "AxiosError") {
        toast.error(error.response.data.msg);
      }
    }
  };

  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="w-full ">
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader className="items-center">
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1  flex flex-col gap-1 p-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                onChange={handleNameChange}
                defaultValue={user.name || ""}
              />
            </div>
            <div className="space-y-1  flex flex-col gap-1 p-1">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                onChange={handleEmailChange}
                defaultValue={user.email || ""}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
