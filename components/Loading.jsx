export default function Loading() {
    return (
        <>
            {/* A Loading Spinner that covers the entire page */}
            <div className="fixed top-0 left-0 w-screen h-screen flex justify-center
        items-center z-50">

                <div
                    className="inline-block h-24 w-24 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status">
                    <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...</span>
                </div>

            </div>

        </>
    )
}