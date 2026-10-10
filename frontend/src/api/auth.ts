import { api } from './client'

export const DEFAULT_DIAL_CODE = '+91'


export async function registerUser(phone: string, dialCode: string = DEFAULT_DIAL_CODE): Promise<void> {
  await api.post('/v1/pwa/user/register', new URLSearchParams({ phone, dial_code: dialCode }))
}


export async function loginUser(
  phone: string,
  otp: string,
  dialCode: string = DEFAULT_DIAL_CODE,
): Promise<string> {
  const { data } = await api.post('/v1/pwa/user/login', new URLSearchParams({ phone, otp, dial_code: dialCode }))
  const token: unknown = data?.data?.token ?? data?.token
  if (typeof token !== 'string' || !token) {
    throw new Error('Login failed: no token in the response.')
  }
  return token
}