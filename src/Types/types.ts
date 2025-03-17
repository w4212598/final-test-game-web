export interface Game {
    id: number;
    name: string;
    provider: number;
    providerName?: string;
    cover: string;
    coverLarge: string;
    date: string;
}

export interface Provider {
    id: number;
    name: string;
    logo: string;
}

export interface Group {
    id: number;
    name: string;
    games: number[];
}

export interface GameData {
    games: Game[];
    providers: Provider[];
    groups: Group[];
}

// 用户信息
export interface User {
    username: string;
    password: string;
}

// react-select 选项
export interface Options<T = number> {
    value: T,
    label: string | number,
}

// 列表筛选参数
export interface FiltersParams {
    name?: string;
    providerIds?: number[];
    groupId?: number;
    sortBy?: string | undefined;
}
