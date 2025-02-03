// src/__tests__/dtos/dto.test.ts
import 'reflect-metadata'
import { validate } from 'class-validator'
import { plainToClass, plainToInstance } from 'class-transformer'
import { AdminUserFilterDTO } from '../../dtos/admin.dto'
import {
  RegisterUserDTO,
  LoginUserDTO,
  VerifyUserDTO,
} from '../../dtos/auth.dto'
import {
  RequestPasswordResetDTO,
  ResetPasswordDTO,
} from '../../dtos/password-reset.dto'
import { UpdateUserDTO } from '../../dtos/user.dto'

describe('DTO Validation', () => {
  describe('AdminUserFilterDTO', () => {
    it('should validate valid data and transform page/limit to numbers', async () => {
      const data = {
        name: 'Alice',
        email: 'alice@example.com',
        isVerified: 'true',
        page: '2',
        limit: '20',
        start_date: '2023-01-01',
        end_date: '2023-02-01',
      }
      const dto = plainToInstance(AdminUserFilterDTO, data, {
        enableImplicitConversion: true,
      })
      const errors = await validate(dto)
      expect(errors.length).toBe(0)
      // Check that the transform has occurred
      expect(dto.page).toBe(2)
      expect(dto.limit).toBe(20)
    })

    it('should fail for invalid email and date formats', async () => {
      const data = {
        email: 'invalid-email',
        start_date: 'not-a-date',
      }
      const dto = plainToInstance(AdminUserFilterDTO, data, {
        enableImplicitConversion: true,
      })
      const errors = await validate(dto)
      // Check for error on email property
      const emailError = errors.find((e) => e.property === 'email')
      // Since your DTO exposes start_date as startDate, check for startDate
      const dateError = errors.find((e) => e.property === 'startDate')
      expect(emailError).toBeDefined()
      expect(dateError).toBeDefined()
    })
  })

  describe('RegisterUserDTO', () => {
    it('should validate correct registration data', async () => {
      const data = {
        name: 'Bob',
        email: 'bob@example.com',
        password: 'supersecret',
      }
      const dto = plainToClass(RegisterUserDTO, data)
      const errors = await validate(dto)
      expect(errors.length).toBe(0)
    })

    it('should fail if name is too short', async () => {
      const data = {
        name: 'Bo',
        email: 'bob@example.com',
        password: 'supersecret',
      }
      const dto = plainToClass(RegisterUserDTO, data)
      const errors = await validate(dto)
      const nameError = errors.find((e) => e.property === 'name')
      expect(nameError).toBeDefined()
    })

    it('should fail for an invalid email', async () => {
      const data = {
        name: 'Bob',
        email: 'bob-at-example.com',
        password: 'supersecret',
      }
      const dto = plainToClass(RegisterUserDTO, data)
      const errors = await validate(dto)
      const emailError = errors.find((e) => e.property === 'email')
      expect(emailError).toBeDefined()
    })

    it('should fail if password is too short', async () => {
      const data = {
        name: 'Bob',
        email: 'bob@example.com',
        password: 'short',
      }
      const dto = plainToClass(RegisterUserDTO, data)
      const errors = await validate(dto)
      const passwordError = errors.find((e) => e.property === 'password')
      expect(passwordError).toBeDefined()
    })
  })

  describe('LoginUserDTO', () => {
    it('should validate valid login data', async () => {
      const data = {
        email: 'bob@example.com',
        password: 'supersecret',
      }
      const dto = plainToClass(LoginUserDTO, data)
      const errors = await validate(dto)
      expect(errors.length).toBe(0)
    })

    it('should fail for an invalid email', async () => {
      const data = {
        email: 'invalid-email',
        password: 'supersecret',
      }
      const dto = plainToClass(LoginUserDTO, data)
      const errors = await validate(dto)
      const emailError = errors.find((e) => e.property === 'email')
      expect(emailError).toBeDefined()
    })
  })

  describe('VerifyUserDTO', () => {
    it('should validate a correct email', async () => {
      const data = { email: 'bob@example.com' }
      const dto = plainToClass(VerifyUserDTO, data)
      const errors = await validate(dto)
      expect(errors.length).toBe(0)
    })

    it('should fail for an invalid email', async () => {
      const data = { email: 'not-an-email' }
      const dto = plainToClass(VerifyUserDTO, data)
      const errors = await validate(dto)
      const emailError = errors.find((e) => e.property === 'email')
      expect(emailError).toBeDefined()
    })
  })

  describe('RequestPasswordResetDTO', () => {
    it('should validate a valid email', async () => {
      const data = { email: 'bob@example.com' }
      const dto = plainToClass(RequestPasswordResetDTO, data)
      const errors = await validate(dto)
      expect(errors.length).toBe(0)
    })

    it('should fail for an invalid email', async () => {
      const data = { email: 'invalid-email' }
      const dto = plainToClass(RequestPasswordResetDTO, data)
      const errors = await validate(dto)
      const emailError = errors.find((e) => e.property === 'email')
      expect(emailError).toBeDefined()
    })
  })

  describe('ResetPasswordDTO', () => {
    it('should validate correct data', async () => {
      const data = {
        token: 'sometoken',
        newPassword: 'supersecret',
      }
      const dto = plainToClass(ResetPasswordDTO, data)
      const errors = await validate(dto)
      expect(errors.length).toBe(0)
    })

    it('should fail if newPassword is too short', async () => {
      const data = {
        token: 'sometoken',
        newPassword: 'short',
      }
      const dto = plainToClass(ResetPasswordDTO, data)
      const errors = await validate(dto)
      const newPasswordError = errors.find((e) => e.property === 'newPassword')
      expect(newPasswordError).toBeDefined()
    })
  })

  describe('UpdateUserDTO', () => {
    it('should validate correct update data', async () => {
      const data = {
        name: 'Alice',
        email: 'alice@example.com',
      }
      const dto = plainToClass(UpdateUserDTO, data)
      const errors = await validate(dto)
      expect(errors.length).toBe(0)
    })

    it('should fail for an invalid email', async () => {
      const data = {
        name: 'Alice',
        email: 'invalid-email',
      }
      const dto = plainToClass(UpdateUserDTO, data)
      const errors = await validate(dto)
      const emailError = errors.find((e) => e.property === 'email')
      expect(emailError).toBeDefined()
    })
  })
})
