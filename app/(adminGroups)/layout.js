"use client";
import { useState } from "react";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../Providers";
import dynamic from "next/dynamic";
const Sidebar = dynamic(() => import('@/components/Sidebar'),{ssr:false})
const Header = dynamic(() => import('@/components/Header'),{ssr:false})

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
        <html lang="en">
          <body>
            <ToastContainer />
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
              {
                <div className="flex h-screen overflow-hidden">
                  {/* <!-- ===== Sidebar Start ===== --> */}
                  <AuthProvider>
                    
                  
                  {/* <!-- ===== Sidebar End ===== --> */}

                  {/* <!-- ===== Content Area Start ===== --> */}
                  <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    {/* <!-- ===== Header Start ===== --> */}
                      
                      {/* <!-- ===== Header End ===== --> */}

                      {/* <!-- ===== Main Content Start ===== --> */}
                      <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                          {children}
                        </div>
                      </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                  </div>
                    </AuthProvider>
                  {/* <!-- ===== Content Area End ===== --> */}
                </div>
              }
            </div>
          </body>
        <script src="https://unpkg.com/cronstrue@latest/dist/cronstrue.min.js" async></script>
        </html>  
    </>
  );
}
