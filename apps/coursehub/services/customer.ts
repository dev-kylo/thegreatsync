import axios from 'axios';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

export interface EmailCheckResponse {
    hasAccount: boolean;
    email: string;
    customerName: string;
}

export interface AuthenticatedRegisterResponse {
    success: boolean;
    message: string;
}

export async function checkEmailForOrder(orderId: string) {
    try {
        const res = await axios.get<EmailCheckResponse>(
            `${strapiUrl}/api/customer/check-email?orderId=${orderId}`
        );
        return res.data;
    } catch (error) {
        console.error('Failed to check email for order:', error);
        throw error;
    }
}

export async function registerAuthenticatedUser(orderId: string, jwt: string) {
    try {
        const res = await axios.post<AuthenticatedRegisterResponse>(
            `${strapiUrl}/api/customer/register-authenticated`,
            { orderId },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('Failed to register authenticated user:', error);
        throw error;
    }
}