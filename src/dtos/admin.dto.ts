import { Expose, Type } from 'class-transformer'
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator'

export class AdminUserFilterDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @Type(() => Boolean)
  isVerified?: boolean

  @IsOptional()
  @Type(() => Number)
  page?: number

  @IsOptional()
  @Type(() => Number)
  limit?: number

  @IsOptional()
  @IsDateString({}, { message: 'startDate must be a valid ISO date string' })
  @Expose({ name: 'start_date' })
  startDate?: string

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO date string' })
  @Expose({ name: 'end_date' })
  endDate?: string
}
