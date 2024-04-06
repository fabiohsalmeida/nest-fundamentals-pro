import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { Payload } from './types/payload.type';

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
}
