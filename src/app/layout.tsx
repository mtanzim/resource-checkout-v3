import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Nav from "./Nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const runtime = "edge";
export const metadata = {
  title: "Resource Checkout",
  description: "Manage resource sharing across your team!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Nav />
          <div className="my-8 mx-4 xl:mx-72">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
