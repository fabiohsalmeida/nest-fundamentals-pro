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