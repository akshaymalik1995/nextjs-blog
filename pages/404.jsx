// A 404 page with a link to the home page
import Link from "next/link";
export default function Custom404() {
    return (
        <>
        <div className="container max-w-3xl mx-auto" >
            <h1 className="text-4xl my-12">404 - Page Not Found</h1>
            <Link href="/" className="btn-black">Go Home
            </Link>
        </div>
        </>
    )
    }