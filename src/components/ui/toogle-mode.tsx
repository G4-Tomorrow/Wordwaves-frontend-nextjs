"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { IconDeviceImac } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function ModeToggle({
  className,
  iconSize,
}: {
  className?: string;
  iconSize?: string;
}) {
  const { setTheme } = useTheme();

  return (
    <div className={cn("flex items-center  border-2 rounded-full", className)}>
      <Button
        variant="ghost"
        className="rounded-full"
        size="icon"
        onClick={() => setTheme("light")}
      >
        <SunIcon className={cn("h-[1.2rem] w-[1.2rem]", iconSize)} />
      </Button>
      <Button
        variant="ghost"
        className="rounded-full"
        size="icon"
        onClick={() => setTheme("dark")}
      >
        <MoonIcon className={cn("h-[1.2rem] w-[1.2rem]", iconSize)} />
      </Button>
      <Button
        variant="ghost"
        className="rounded-full"
        size="icon"
        onClick={() => setTheme("system")}
      >
        <IconDeviceImac className={cn("h-[1.2rem] w-[1.2rem]", iconSize)} />
      </Button>
    </div>
  );
}
