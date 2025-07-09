export interface HTTPServer {
  start(port: number): Promise<void>;
  registerRoutes(): void;
}
