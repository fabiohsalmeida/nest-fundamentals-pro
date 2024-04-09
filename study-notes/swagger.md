# What to do to include swagger:

## Import dependencies

Import the swagger dependency of nestjs: ``npm i @nestjs/swagger``

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

