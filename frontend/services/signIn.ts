import axios from 'axios';
import type { ErrorResponse, SignInResponse } from '../types';

const strapiUrl = process.env.STRAPI_URL;


export async function signIn({ email, password }: { email: string, password: string; }) {
    const res = await axios.post<SignInResponse>(`${strapiUrl}/api/auth/local`, {
        identifier: email,
        password,
    });
    return res.data;
}

// export async function signIn({ email, password }: { email: string, password: string; }) {
//     console.log('CALLING');
//     console.log({ email, password })
//     const data = await fetch(`${strapiUrl}/api/auth/local`, {
//         method: 'POST',
//         body: JSON.stringify({
//             identifier: email,
//             password,
//         })
//     })
//     const resp = await data.json();
//     // console.dir(res.data)
//     return resp as SignInResponse;
// }

