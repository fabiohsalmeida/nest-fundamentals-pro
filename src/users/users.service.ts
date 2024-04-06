import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

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
}
