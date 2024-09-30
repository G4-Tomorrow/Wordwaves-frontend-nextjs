"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { IconDeviceImac } from "@tabler/icons-react";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center  border-2 rounded-full">
      <Button
        variant="ghost"
        className="rounded-full"
        size="icon"
        onClick={() => setTheme("light")}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <Button
        variant="ghost"
        className="rounded-full"
        size="icon"
        onClick={() => setTheme("dark")}
      >
        <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <Button
        variant="ghost"
        className="rounded-full"
        size="icon"
        onClick={() => setTheme("system")}
      >
        <IconDeviceImac />
      </Button>
    </div>
  );
}
