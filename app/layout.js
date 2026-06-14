import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HeaderVisibility from "@/components/HeaderVisibility";

export const metadata = {
  title: "Pulse",
  description:
    "You could social using your IdeaA simple tweet feed built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen bg-gray-100">
        <HeaderVisibility>
          <Header />
        </HeaderVisibility>
        <div className="flex">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
