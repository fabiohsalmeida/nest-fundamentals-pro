import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async create(userDto: CreateUserDto): Promise<User> {
        const salt = await bcrypt.genSalt();
        userDto.password = await bcrypt.hash(userDto.password, salt);
        const user = await this.usersRepository.save(userDto);
        delete user.password;
        return user;
    }

    async findOne(data: LoginDto) : Promise<User> {
        const user = await this.usersRepository.findOneBy({ email: data.email });
        if (!user) {
            throw new UnauthorizedException('Could not find user');
        }
        return user;
    }

    async findById(userId: number) : Promise<User> {
        return await this.usersRepository.findOneBy({id: userId});
    }
    
    async updateSecretKey(id: number, twoFASecret: string) {
        await this.usersRepository.update(id, {twoFASecret: twoFASecret, enable2FA: true});
    }

    async disable2FactorAuthentication(id: number): Promise<UpdateResult> {
        return await this.usersRepository.update(id, {twoFASecret: null, enable2FA: false});
    }
}
