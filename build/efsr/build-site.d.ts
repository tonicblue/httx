export type Options = {
    routes: string;
    output: string;
    port?: number;
    public: string;
};
export default function buildSite(options: Options): string;
