export type MenuType = 'watch' | 'code' | 'read' | 'draw' | 'imagine' | 'listen' | 'play';

export type MenuItem = {
    name: string;
    level: number,
    progress?: number | string,
    completed?: boolean,
    type?: MenuType
    current?: boolean;
    href?: string;
    children?: MenuItem[]
}


export type TopicStepT = {
    image: string;
    code?: string;
    text: string;
    id: number,
    orderNumber: number,
    name: string,
    status: 'current' | 'complete' | 'default'
}

export type ErrorResponse = {
    data: null,
    error: {
        status: number,
        name: string,
        message: string,
        details?: unknown
    }
}

export type SignInResponse = {
    jwt: string,
    user: {
        id: number,
        username: string,
        email: string,
        provider: string,
        confirmed: boolean,
        blocked: boolean,
        createdAt: Date,
        updatedAt: Date
    }
}