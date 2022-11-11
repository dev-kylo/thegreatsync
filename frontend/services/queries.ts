import axios, { AxiosStatic } from "axios";

const strapiUrl = process.env.STRAPI_URL;

export const getText = async (id: string, axios: AxiosStatic) => {
    const res = await axios.get(`${strapiUrl}/api/text-image-codes/${id}`);
    return res.data;
};