export interface Query {
    [key: string]: string | string[];
}
export interface Headers {
    [name: string]: string | string[];
}
export interface HeaderNames {
    [name: string]: string;
}
export interface BaseOptions {
    url?: string;
    query?: string | Query;
    headers?: Headers;
}
export default class Base {
    url: string;
    headers: Headers;
    headerNames: HeaderNames;
    query: Query;
    constructor({url, headers, query}: BaseOptions);
    set(headers: Headers): Base;
    set(name: string, value: string | string[]): Base;
    append(name: string, value: string | string[]): Base;
    name(name: string): string;
    get(): Headers;
    get(name: string): string;
    remove(name: string): Base;
    type(): string;
    type(value: string): Base;
    fullUrl(): string;
}
