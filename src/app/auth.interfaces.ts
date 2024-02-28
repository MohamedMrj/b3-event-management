export interface DecodedToken {
  exp: number;
  iat: number;
  nbf: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}

export interface UserDetails {
  expirationTime: number;
  userId: string;
  username: string;
  role: string;
  issuedAt: number;
  notValidBefore: number;
}

export interface TokenValidationResponse {
  valid: boolean;
  error?: string;
}

export interface UserAccount {
  id: string;
  userType: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  lastChanged: string;
}
