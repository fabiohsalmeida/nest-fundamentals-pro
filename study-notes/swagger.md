# What to do to include swagger:

## Import dependencies

### Installs
Import the swagger dependency of nestjs: ``npm i @nestjs/swagger``

### Aditional external configurations
Include the plugin in ``nest-cli.json``:

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
  //here
    "plugins": [
      {
        "name": "@nestjs/swagger",
        "options": {
          "introspectComments": true
        }
      }
    ]
  },
}

```

## Configure the code
### main.js

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// the imports
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // starts here
  const config = new DocumentBuilder()
    .setTitle('Spotify Clone')
    .setDescription('The Spotify Clone API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // that line sets the swagger to /api, example http://localhost:3000/api
  SwaggerModule.setup('api', app, document);
  // ends here
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port'));
}
bootstrap();
```

### Define a tag to a group of routes

Go to the controller and add ``@ApiTags('tagName')``

Example:
```ts
...
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    ...
}
```

### Define a route with informations

```ts
...
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    ...
    @Post('signup')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ 
        status: 201,
        description: 'It will return the user in the response'
     })
    signup(
        @Body()
        userDto: CreateUserDto
    ) : Promise<User> {
        return this.usersService.create(userDto);
    }
    ...
}
```

### To bind authorization to a route

Update the bootstrap function

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Spotify Clone')
    .setDescription('The Spotify Clone API Documentation')
    .setVersion('1.0')
    //this
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      //it will be the alias name for the authentication method for swagger
      'JWT-auth'
    )
    //end
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port'));
}
bootstrap();
```

Configure the route that you want

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtGuard } from './auth/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  @UseGuards(JwtGuard)
  // that decorator here
  @ApiBearerAuth('JWT-auth')
  getHelloProtected(): string {
    return 'This route is protected by oauth2';
  }
}
```

You can do the same for all routes in a controller

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtGuard } from './auth/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
// that decorator here
@ApiBearerAuth('JWT-auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  @UseGuards(JwtGuard)
  getHelloProtected(): string {
    return 'This route is protected by oauth2';
  }
}
```