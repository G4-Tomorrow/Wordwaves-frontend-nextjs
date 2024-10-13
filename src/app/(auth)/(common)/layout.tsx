"use client"
import React from 'react'
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Bên Trái với Ảnh */}
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Hình nền"
            src="https://media.istockphoto.com/id/1369102632/vector/spring-wave-background.jpg?s=612x612&w=0&k=20&c=KMgUPdYquZpn1e_2RjzGZFgilXzE6ohn1rXwqeTrbPE="
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="#">
              <svg
                className="h-8 sm:h-10"
                viewBox="0 0 28 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <path
                  d="M0.41 10.3847C1.14777 7.4194 2.85643..."
                  fill="currentColor"
                />
              </svg>
            </a>

            <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Chào mừng đến với <span className="text-primary">WORD WAVES</span>
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Khám phá dòng chảy của ngôn từ, chia sẻ câu chuyện và để giọng nói của bạn vang xa.
            </p>
          </div>
        </section>

        {/* Bên Phải với Nội Dung */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="w-full max-w-xl lg:max-w-3xl">
            {/* Thanh Tab Điều Hướng */}
            <div className="relative mb-8">
              <div className="flex justify-between border-b border-gray-300">
                <TabButton href="/sign-in" label="Đăng Nhập" />
                <TabButton href="/sign-up" label="Đăng Ký" />
              </div>

              {/* Gạch Chân Cố Định */}
              <motion.div
                className="absolute bottom-0 h-0.5 bg-primary rounded transition-all duration-300"
                initial={false}
                animate={{
                  left: pathname === '/sign-in' ? '0%' : '50%',
                  width: '50%',
                }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {children}
          </div>
        </main>
      </div>
    </section>
  )
}

function TabButton({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex-1 py-3 text-center text-lg font-semibold transition-colors duration-300",
        isActive ? "text-primary" : "text-gray-500 hover:text-primary"
      )}
    >
      {label}
    </Link>
  )
}

export default AuthLayout
