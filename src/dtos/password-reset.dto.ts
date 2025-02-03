import { IsEmail, IsString, MinLength } from 'class-validator'

export class RequestPasswordResetDTO {
  @IsEmail()
  email!: string
}

export class ResetPasswordDTO {
  @IsString()
  token!: string

  @IsString()
  @MinLength(8)
  newPassword!: string
}
