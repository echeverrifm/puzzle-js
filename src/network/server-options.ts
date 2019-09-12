export default interface ServerOptions {
    port?: number;
    hostname?: string;
    http2?: boolean;
    https?: {
        allowHTTP1?: boolean;
        key: string;
        cert: string;
    };
}