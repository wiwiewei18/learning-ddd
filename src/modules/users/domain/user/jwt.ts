export interface JWTEmailVerificationClaims {
  email: string;
}

export interface JWTUserClaims {
  userId: string;
  email: string;
}
