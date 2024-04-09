
### ApiKey Guard binded to AuthGuard('bearer')
I didn't understand how the api key works, those are the files:

Install new package ``npm i passport-http-bearer``

Create Strategy
```ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-http-bearer';
import { AuthService } from "./auth.service";

@Injectable()
export class ApikeyStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(apiKey: string) {
        const user = await this.authService.validateUserByApiKey(apiKey);
        if (!user) {
            throw new UnauthorizedException();
        } else {
            return user;
        }
    }
}
```

The logic inside the service is pretty standart:
```ts
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private artistsService: ArtistsService
    ) {}
    ...
    async validateUserByApiKey(apiKey: string): Promise<User> {
        return await this.usersService.findByApiKey(apiKey);
    }
}
```

The same goes for the user service logic:
```ts
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}
    ...
    async findByApiKey(apiKey: string): Promise<User> {
        return await this.usersRepository.findOneBy({ apiKey });
    }
}
```

Include ApiKeyStrategy into providers
```ts
@Module({
  ...
  providers: [AuthService, JwtStrategy, ApikeyStrategy],
  ...
})
export class AuthModule {}
```

And here goes the question, how it's bind here:
```ts
@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {}
    ...
    @Get('profile')
    @UseGuards(AuthGuard('bearer'))
    getProfile(
        @Request()
        request
    ) {
        delete request.user.password;

        return {
            msg: 'authenticated with api key',
            user: request.user
        }
    }
}
```

Probably it's something inside passport-http-bearer bind to it, need to check it after.

# Unable to do those modules:
- Module 8 - 05:24:29 - Validate Env Variables: I just was not able to create the DTO???
- Module 8 - 05:35:48 - Hot Module Reloading: I just skiped that, I know that webpack is a complex theme and I want to look it in other time