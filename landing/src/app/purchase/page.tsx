'use client'
import { useEffect } from "react"


const Purchase = () => {

    useEffect(() => {

        // (window as any).Paddle.Setup({ vendor: 13136});
        // (window as any).Paddle.Environment.set('sandbox');
        // Sandbox product 54653
        //842496
    
        const vendorId = process.env.NEXT_PUBLIC_VENDORID || '1';
        (window as any).Paddle.Setup({ vendor: +vendorId});
    
        (window as any).Paddle.Checkout.open({
        method: 'inline', // set to `inline`
        product: 54653, // replace with a product ID or plan ID
        allowQuantity: false,
        disableLogout: true,
        frameTarget: 'checkout-container', // className of your checkout <div>
        frameInitialHeight: 450, // `450` or above
        frameStyle: 'width:100%; padding:1.5rem; min-width:312px; background-color: transparent; border: none;' // `min-width` must be set to `286px` or above with checkout padding off; `312px` with checkout padding on.
        });
      }, [])

    return (
        <div className="relative isolate px-6 pt-14 lg:px-8 min-h-screen w-auto bg-[url('https://res.cloudinary.com/the-great-sync/image/upload/c_crop,w_2000,h_1000/v1689097216/3000x2000/Execution_Closure_Scene_yobija.jpg')] ">

          <div className="max-w-xl mx-auto bg-white min-h-full pb-8">
            <div className="checkout-container"></div>
            </div>
        </div>
    )
}

export default Purchase;