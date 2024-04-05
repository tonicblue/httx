import { type RequestHandler, type Application } from 'express';
export type HandlerThisArg = {
    handler: RequestHandler;
};
export type HttpVerb = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'options' | 'head' | 'all';
export type Route = {
    verb: HttpVerb;
    routePath: string | RegExp;
    handler: RequestHandler;
};
export declare function addRoutesToApp(app: Application): void;
