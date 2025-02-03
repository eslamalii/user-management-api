import { IsEmail, IsString, MinLength } from 'class-validator'

export class RegisterUserDTO {
  @IsString()
  @MinLength(3)
  name!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string
}

export class LoginUserDTO {
  @IsEmail()
  email!: string

  @IsString()
  password!: string
}

export class VerifyUserDTO {
  @IsEmail()
  email!: string
}
