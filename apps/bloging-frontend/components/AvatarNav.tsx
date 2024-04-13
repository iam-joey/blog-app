import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function AvatarNav() {
  return (
    <div>
      <Avatar>
        <AvatarImage src="https://avatars.githubusercontent.com/u/38688596?s=400&u=537ec3624a74119be8caba48e5ee38610ad1717a&v=4" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}

export default AvatarNav;
