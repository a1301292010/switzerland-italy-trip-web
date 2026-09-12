import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "瑞意随行 · 2026",
  description: "瑞士与意大利九日旅行的手机执行面板",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}

