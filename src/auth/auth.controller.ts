import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Enable2FAType } from './types/enable2fa.type';
import { JwtGuard } from './jwt.guard';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { UpdateResult } from 'typeorm';

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
    ) : Promise<{ accessToken: string } | { validate2FA: string; message: string }> {
        return this.authService.login(loginDto);
    }

    @Post('enable-2fa')
    @UseGuards(JwtGuard)
    enable2FactorAuthentication(
        @Request()
        request
    ) : Promise<Enable2FAType> {
        return this.authService.enable2FactorAuthentication(request.user.userId);
    }

    @Post('validate-2fa')
    @UseGuards(JwtGuard)
    validate2FactorAuthentication(
        @Request()
        request,
        @Body()
        validateTokenDto: ValidateTokenDto,
    ) : Promise<{ verified: boolean }> {
        return this.authService.validate2FactorAuthenticationToken(
            request.user.userId,
            validateTokenDto.token
        );
    }

    @Post('disable-2fa')
    @UseGuards(JwtGuard)
    disable2FactorAuthentication(
        @Request()
        request,
        @Body()
        validateTokenDto: ValidateTokenDto
    ) : Promise<UpdateResult> {
        return this.authService.disable2FactorAuthentication(
            request.user.userId,
            validateTokenDto.token
        );
    }

    @Post('generate-apikey')
    @UseGuards(JwtGuard)
    generateApiKeyToUser(
        @Request()
        request
    ) : Promise<{ apiKey: string }> {
        return this.authService.generateApiKeyToUser(request.user.userId);
    }
}
