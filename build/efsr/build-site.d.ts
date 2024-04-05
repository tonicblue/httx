export type Options = {
    routes: string;
    output: string;
    buildCommand?: string;
    port?: number;
};
export default function buildSite(options: Options): string;
