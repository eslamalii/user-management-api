export interface IPasswordResetService {
  requestPasswordReset(email: string): Promise<string>
  resetPassword(token: string, newPassword: string): Promise<void>
}
