'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from "react"


const Purchase = () => {

    const router = useRouter(); 

    useEffect(() => {

        // (window as any).Paddle.Setup({ vendor: 13136});
        // (window as any).Paddle.Environment.set('sandbox');
        // Sandbox product 54653
        // Sandbox upsell 67894
        // 844435
        // 873686
    
        const vendorId = process.env.NEXT_PUBLIC_VENDORID || '1';
        (window as any).Paddle.Setup({ vendor: +vendorId});
    
        (window as any).Paddle.Checkout.open({
          method: 'overlay', // set to `inline`
          product: 844435, // replace with a product ID or plan ID
          allowQuantity: false,
          disableLogout: true,
          upsell: 873686,
          upsellTitle: 'LIMITED OFFER: Video Coaching',
          upsellText: 'Include 5x 1 hour personal video coaching sessions for $497.00',
          closeCallback: () => {
            router.push('/#checkout')
          }
        });
      }, [router])

    return (
        <div className="relative isolate px-6 pt-14 lg:px-8 min-h-screen w-auto bg-[url('https://res.cloudinary.com/the-great-sync/image/upload/c_crop,w_2000,h_1000/v1689097216/3000x2000/Execution_Closure_Scene_yobija.jpg')] ">
        </div>
    )
}

export default Purchase;