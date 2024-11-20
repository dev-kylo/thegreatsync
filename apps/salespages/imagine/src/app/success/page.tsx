'use client'
import { Button } from "@/components/Button";


const Purchase = () => {
    return (
        <div className="relative isolate px-6 pt-14 lg:px-8 min-h-screen w-auto bg-[url('https://res.cloudinary.com/the-great-sync/image/upload/c_crop,w_2000,h_1000/v1689097216/3000x2000/Execution_Closure_Scene_yobija.jpg')] ">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h1 className="text-2xl font-bold mb-4">Congratulations 🥳, you have successfully joined Imagine JavaScript</h1>
                    <p className="text-lg">Please check your email for further instructions.</p>
                    <Button
                        href='/'
                        color='blue'
                        className="mt-8"
                    >
                        Return to main page
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Purchase;