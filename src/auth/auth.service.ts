import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { Payload } from './types/payload.type';
import * as speakeasy from 'speakeasy';
import { Enable2FAType } from './types/enable2fa.type';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private artistsService: ArtistsService
    ) {}

    async login(loginDto: LoginDto) : Promise<{ accessToken: string }> {
        const user = await this.usersService.findOne(loginDto);
        const passwordMatched = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (passwordMatched) {
            delete user.password;
            const payload: Payload = {userId: user.id};

            const artist = await this.artistsService.findArtist(user.id);
            if (artist) {
                payload.artistId = artist.id
            }

            return {
                accessToken: this.jwtService.sign(payload)
            };
        } else {
            throw new UnauthorizedException("Invalid password");
        }
    }

    async enable2FactorAuthentication(userId: number): Promise<Enable2FAType> {
        const user = await this.usersService.findById(userId);
        if (user.enable2FA) {
            return { secret:user.twoFASecret };
        }
        const secret = speakeasy.generateSecret();
        user.twoFASecret = secret.base32;
        await this.usersService.updateSecretKey(user.id, user.twoFASecret);
        return { secret: user.twoFASecret };
    }

    async validate2FactorAuthenticationToken(
        userId: number,
        token: string
    ): Promise<{ verified: boolean; }> {
        try {
            const user = await this.usersService.findById(userId);
            const verified = speakeasy.totp.verify({
                secret: user.twoFASecret,
                token: token,
                encoding: 'base32'
            });
            if (verified) {
                return { verified: true };
            } else {
                return { verified: false };
            }
        } catch(err) {
            throw new UnauthorizedException("Error verifying token");
        }
    }
}
