import Nav from "@/components/Nav";
import "@/styles/globals.css";
import Footer from "@/components/Footer";
export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body>
          <Nav />
            <main className="app bg-meta-2">{children}</main>
          
        </body>
      </html>
    </>
  );
}
