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


export type ImageStep = {
    id: number,
    orderNumber: number,
    name: string,
    status: 'current' | 'complete' | 'default'
}
