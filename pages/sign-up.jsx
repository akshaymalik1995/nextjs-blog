export async function getServerSideProps(context) {
    return {
        redirect: {
            destination: '/',
            permanent: true,
        },
    }
}

import { useRouter } from "next/router"
export default function SignUp() {
    const router = useRouter()
    router.push("/")
    return (
        <>
        </>
    )
}