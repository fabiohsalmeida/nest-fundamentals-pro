## Setup enviroment variables

### First setup
First you need to import the dependency: ``npm i @nestjs/config``

After it create a the files, I created a folder for all the envs, the extension of the file doesn't matter but I used the *.env extension, created 2 files:

development.env
```env
PORT=3000
```
production.env
```env
PORT=4000
```

Then I created a config/configuration.ts file:

```ts
export default() => ({
    port: parseInt(process.env.PORT)
})
```

Then I fixed the app-module:
```ts
...
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ...,
    ConfigModule.forRoot({
      envFilePath: ['.env/development.env','.env/production.env'],
      isGlobal: true,
      load: [configuration]
    }),
    ...
  ],
  ...
})
export class AppModule implements NestModule {
  ...
}
```

### How to use the port
You need to change the main.ts including that block of code:

```ts
const configService = app.get(ConfigService);
await app.listen(configService.get<number>('port'));
```

Here's the full file:
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port'));
}
bootstrap();
```

## [Data Source] Include new variables after it's all set
Create the variables inside the .env files:

.env/development.env
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=myuser
DB_PASSWORD=secret
DB_NAME=nest-spotify-clone
```

.env/production.env
```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=myuser
DB_PASSWORD=secret
DB_NAME=nest-spotify-clone
```

Include it into the config/configuration.ts file:
```ts
export default() => ({
    port: parseInt(process.env.PORT),
    dbHost: process.env.DB_HOST,
    dbPort: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME
});
```

Remove the other datasource and create a new variable inside db/data-source.ts:

```ts
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async(
        configService: ConfigService
    ): Promise<TypeOrmModuleOptions> => {
        return {
            type: 'postgres',
            // it's the name of the field inside configuration.ts, can change it
            host: configService.get<string>('dbHost'),
            port: configService.get<number>('dbPort'),
            username: configService.get<string>('username'),
            database: configService.get<string>('dbName'),
            password: configService.get<string>('password'),
            entities: ['dist/**/*.entity.js'],
            synchronize: false,
            migrations: ['dist/db/migrations/*.js']
        }
    }
}
```

Last but not least, change app-module:

```ts
...
import { TypeOrmModule } from '@nestjs/typeorm';
...
import { typeOrmAsyncConfig } from 'db/data-source';
...

@Module({
  imports: [
    // note that it's not using forRoot anymore, it's forRootAsync
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ...
  ],
  ...
})
export class AppModule implements NestModule {
  ...
}
```
And it's all done.

## [secret] Enviroment variable that is used in runtime (not db and not port):

Create the variable inside the .env file:

```env
SECRET=HAD_12X#@
```

Include it inside config/configuration.ts

```ts
export default() => ({
    secret: process.env.SECRET
})
```

Inside the module where you want to use it, import the ConfigModule to be able to inject the ConfigService dependency:

```ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ArtistsModule } from 'src/artists/artists.module';
import { ApikeyStrategy } from './api-key.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: {
          expiresIn: '1d'
        }
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    ArtistsModule
  ],
  providers: [AuthService, JwtStrategy, ApikeyStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
```

It's the case of the secret, so it's already using in there, but if you need to use a enviroment variable you need to inject through constructor and call:

```ts
await configService.get<string>('[nameOfVaribleInsideConfiguration.tsFile]')
```