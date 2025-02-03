import { IsString, IsEmail, IsOptional } from 'class-validator'

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string
}
