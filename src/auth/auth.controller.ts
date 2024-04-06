import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {}

    @Post('signup')
    signup(
        @Body()
        userDto: CreateUserDto
    ) : Promise<User> {
        return this.usersService.create(userDto);
    }

    @Post('login')
    login(
        @Body()
        loginDto: LoginDto
    ) {
        return this.authService.login(loginDto);
    }
}
