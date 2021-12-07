export interface RegisterRequest {
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  password: string,
}

export interface LoginRequest {
  username: string,
  password: string,
}
