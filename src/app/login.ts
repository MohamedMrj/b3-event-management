export interface LoginInfo {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    email?: string; 
  }