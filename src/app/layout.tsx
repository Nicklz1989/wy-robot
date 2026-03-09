import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '往约智能问答系统',
  description: '往约上门推拿 - 专业正规的上门服务平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
