import Navbar from "./Navbar";
export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main  className="container mx-auto p-5">
                {children}
            </main>
            
        </>
    )
}