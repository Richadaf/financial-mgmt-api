/**
 * @fileoverview This module provides a controller for user-related operations.
 * @module UserController
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires ../services/user.service
 * @requires ../models/user.model
 * @requires ../dto/login.dto
 * @requires ../dto/logout.dto
 * @requires ../dto/user.dto
 * @requires ../dto/response.dto
 * @requires ../decorators/roles.decorator
 * @requires ../enums/userRoles.enum
 * @requires ../guards/jwt-auth.guard
 * @requires ../guards/roles.guard
 * @requires ../dto/changeRole.dto
 */
import {
  Controller,
  Body,
  UsePipes,
  ValidationPipe,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { StrippedUser, TransformedUser } from '../models/user.model';
import LoginDto from '../dto/login.dto';
import LogoutDto from '../dto/logout.dto';
import UserDto from '../dto/user.dto';
import ResponseDTO from '../dto/response.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRoles } from '../enums/userRoles.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import ChangeRoleDto from '../dto/changeRole.dto';
/**
 * @class
 * @classdesc This class provides a controller for user-related operations.
 */
@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}
  /** Endpoint for registering a user. */
  @Post('register')
  @UsePipes(new ValidationPipe())
  public async register(
    @Body() user: UserDto,
  ): Promise<ResponseDTO<StrippedUser>> {
    const data = await this.userService.register(user);
    return {
      data,
      success: !!data,
      message: data ? 'User created successfully' : 'Failed to create user',
    };
  }
  /** Endpoint for logging in a user. */
  @Post('login')
  @UsePipes(new ValidationPipe())
  public async login(
    @Body() payload: LoginDto,
  ): Promise<ResponseDTO<{ user: TransformedUser; token: string }>> {
    const data = await this.userService.login(payload);
    return {
      data,
      success: !!data,
      message: data ? 'User logged in successfully' : 'Login Failed',
    };
  }
  /** Endpoint for logging out a user. */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  public async logout(@Body() payload: LogoutDto): Promise<ResponseDTO<null>> {
    const data = await this.userService.logout(payload);
    return {
      success: !!data,
      message: data ? 'User logged out successfully' : 'Logout Failed',
    };
  }
  /** Endpoint for logging out a user from all sessions. */
  @Post('logoutAll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  public async logoutAll(
    @Body() payload: LogoutDto,
  ): Promise<ResponseDTO<null>> {
    const data = await this.userService.logoutAll(payload);
    return {
      success: !!data,
      message: data ? 'User logged out from all successfully' : 'Logout Failed',
    };
  }
  /** Endpoint for granting a user admin privileges. */
  @Post('grantAdmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.USER)
  public async grantAdmin(
    @Body() payload: ChangeRoleDto,
  ): Promise<ResponseDTO<null>> {
    const data = await this.userService.grantAdmin(payload);
    return {
      success: !!data,
      message: data
        ? 'User role switched to admin successfully'
        : 'Failed to change role',
    };
  }
  /** Endpoint for revoking a user's admin privileges. */
  @Post('grantUser')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  public async grantUser(
    @Body() payload: ChangeRoleDto,
  ): Promise<ResponseDTO<null>> {
    const data = await this.userService.grantUser(payload);
    return {
      success: !!data,
      message: data
        ? 'User role switched to admin successfully'
        : 'Failed to change role',
    };
  }
  /** Endpoint for testing the service. */
  @Get()
  public get(): string {
    return 'Hello World!';
  }
}
