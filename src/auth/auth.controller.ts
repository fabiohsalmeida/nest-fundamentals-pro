import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private usersService: UsersService) {}

    @Post('signup')
    signup(
        @Body()
        userDto: CreateUserDto
    ) : Promise<User> {
        return this.usersService.create(userDto)
    }
}
