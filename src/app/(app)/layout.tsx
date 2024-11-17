import { Badge } from "@/components/ui/badge";
import SidebarApp from "./sidebar-app";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`antialiased bg-[#f4f7fc]`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <div className="lg:hidden flex flex-col items-center justify-center h-screen">
          <Badge className="bg-primary">Mobile currently unavailable</Badge>
          <div>Please open this page on desktop</div>
        </div>
        <div
          className={
            "hidden lg:flex flex-col h-screen w-full md:flex-row dark:bg-[#171717] overflow-hidden"
          }
        >
          <SidebarApp />
          <div className="w-full p-5 overflow-y-auto dark:scrollbar-dark scrollbar-hide">
            {children}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
