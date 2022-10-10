export type MenuType = 'watch' | 'code' | 'read' | 'draw' | 'imagine' | 'listen';

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
