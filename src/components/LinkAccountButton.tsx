"use client";

import React from "react";
import { Button } from "./ui/button";
import { getAurinkoAuthURL } from "@/lib/aurinko";

const LinkAccountButton = () => {
  return (
    <Button
      onClick={async () => {
        const authURL = await getAurinkoAuthURL("Google");
        window.location.href = authURL;
        console.log(authURL);
      }}
    >
      Link Account
    </Button>
  );
};

export default LinkAccountButton;
