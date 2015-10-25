import Base, { BaseOptions, Headers } from './base';
import Request, { PopsicleError } from './request';
export interface ResponseOptions extends BaseOptions {
    body: any;
    status: number;
}
export interface ResponseJSON {
    headers: Headers;
    body: any;
    url: string;
    status: number;
}
export default class Response extends Base {
    status: number;
    body: any;
    request: Request;
    constructor(options: ResponseOptions);
    statusType(): number;
    error(message: string, type: string, error?: Error): PopsicleError;
    toJSON(): ResponseJSON;
}
