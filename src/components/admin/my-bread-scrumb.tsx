"use client";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import breadCrumbList from "@/lib/breadCrumbList";

import { useEffect, useState } from "react";

export function BreadcrumbWithCustomSeparator() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrumbList.map((breadcrumb, index) => (
          <BreadcrumbItem key={index}>
            {breadcrumb.url ? (
              <BreadcrumbLink>
                <Link href={breadcrumb.url}>{breadcrumb.title}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
            )}
            {index < breadCrumbList.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
