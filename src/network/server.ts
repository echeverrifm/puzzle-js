import https from "https";
import http from "http";
import http2 from "http2";

import ServerOptions from "./server-options";

type Handler = (req: http.IncomingMessage | http2.Http2ServerRequest, res: http.OutgoingMessage | http2.Http2ServerResponse) => void;

export default class Server {
  instance: http.Server | https.Server | http2.Http2SecureServer | http2.Http2Server;

  private options: ServerOptions;
  protected readonly handler: Handler;


  constructor(handler: Handler, options?: ServerOptions) {
    this.options = options || {};
    this.handler = handler;

    this.instance = this.create();
  }

  listen(cb?: () => void) {
    if (!this.options.hostname) {
      this.instance.listen(this.options.port || 8000, cb);
    } else {
      this.instance.listen(this.options.port || 8000, this.options.hostname, cb);
    }
  }

  close() {
    if(this.instance) {
        this.instance.close();
    }
  }

  private create() {
    if (this.options.https) {
      const httpsSettings = {
        key: this.options.https.key,
        cert: this.options.https.cert,
      };
      if (this.options.http2) {
        return http2.createSecureServer({
          ...httpsSettings,
          allowHTTP1: typeof this.options.https.allowHTTP1 === "boolean" ? this.options.https.allowHTTP1 : true
        }, this.handler);
      } else {
        return https.createServer(httpsSettings, this.handler)
      }
    } else if (this.options.http2) {
      return http2.createServer(this.handler)
    } else {
      return http.createServer(this.handler)
    }
  }
}
