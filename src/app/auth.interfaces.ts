export interface DecodedToken {
  exp: number;
  iat: number;
  nbf: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
}

export interface UserDetails {
  expirationTime: number;
  userId: string;
  username: string;
  issuedAt: number;
  notValidBefore: number;
}

export interface TokenValidationResponse {
  valid: boolean;
  error?: string;
}
