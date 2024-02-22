export interface LoginInfo {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username?: string;
}
