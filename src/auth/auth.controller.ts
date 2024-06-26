import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GetUser, GetRawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles.inteface';
import { Auth } from './decorators/auth.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/user-login.dto';
import { User } from './entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

    
  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(@Req() request: Express.Request, @GetUser() user: CreateUserDto, @GetUser('email') email: string, @GetRawHeaders('rawHeaders') rawHeaders: string[] ){
    
    console.log(rawHeaders);
    
    return {
      message: 'This is a private route',
      user,
      email
    }
  }

  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute2(@GetUser() user: CreateUserDto){

    return {
      message: 'This is a private route',
      user
    }
  }

  @Get('private3')
  @UseGuards(AuthGuard(), UserRoleGuard)
  @RoleProtected(ValidRoles.admin)
  testingPrivateRoute3(@GetUser() user: CreateUserDto){

    return {
      message: 'This is a private route',
      user
    }
  }

  @Get('private4')
  @Auth(ValidRoles.admin)
  testingPrivateRoute4(@GetUser() user: CreateUserDto){

    return {
      message: 'This is a private route',
      user
    }
  }
}
