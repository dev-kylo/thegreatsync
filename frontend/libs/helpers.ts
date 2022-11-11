
export function serverRedirectObject(url: string, permanent: boolean = true) {
    return {
        redirect: {
            destination: url,
            permanent: permanent,
        },
    };
}