export interface DatabaseConnection {
  isConnected(): Promise<boolean>;
}
