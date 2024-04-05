# Study notes:
## How to force injection of a mock value
### Mock a method of a class
```typescript
import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

const mockSongsService = {
  findAll() {
    return [{id: 1, title: 'Lasting Lover', artists: ['Siagla']}];
  }
}

@Module({
  controllers: [SongsController],
  providers: [
    SongsService,
    {
      provide: SongsService,
      useValue: mockSongsService
    }
  ]
})
export class SongsModule {}
```
### Mock a value

Create the variable with the mocked value:

```typescript
// This is the type of a connection
export type Connection = {
    CONNECTION_STRING: string;
    DB: string;
    DBNAME: string;
}
// This is the actual variable
export const connection: Connection = {
    CONNECTION_string: 'CONNEC',
    DB: 'MYSQL',
    DBNAME: 'TEST'
}
```

Fix the module to receive the mocked value when a variable of it's type is called:

```typescript
// Inside the module:
import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connection';

@Module({
  controllers: [SongsController],
  providers: [
    SongsService,
    {
      provide: 'CONNECTION',
      useValue: connection
    }
  ]
})
export class SongsModule {}
```

Now inject it as a bean where you want it to be replaced

```typescript
import { Get } from '@nestjs/common';
import { SongsService } from './songs.service';
import { Connection } from 'src/common/constants/connection';

@Controller('songs')
export class SongsController {
    constructor(
        private songsService: SongsService,
        @Inject('CONNECTION')
        private connection: Connection
    ) {
        console.log(`It works ${this.connection.DB}`)
    }

    @Get()
    findAll() {
        return this.songsService.findAll()
    }
}
```

### A whole configuration file

When you need to have a file of configuration, with many variables / methods:

Firstly create the injectable file

```typescript
// in: src/common/providers/DevConfigService.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class DevConfigService {
    DBHOST = 'localhost';

    getDbHost() {
        return this.DBHOST;
    }
}
```

Include in the module

```typescript
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { DevConfigService } from 'src/common/providers/DevConfigService.ts'

@Module({
    imports: [SongsModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: DevConfigService,
            useClass: DevConfigService
        }
    ],
})
export class AppModule {}
```

Now just inject it where you want to use

```typescript
import { Injectable } from '@nestjs/common';
import { DevConfigService } from '.common/providers/DevConfigService';

@Injectable()
export class AppService {
    constructor(private devConfigService: DevConfigService) {}

    getHello(): string {
        return `Hello, here is the db host (?): ${devConfigService.getDbHost()}`
    }
}
```

### Provider with enviroment injections

Firstly create the configuration wherever you want:

```typescript
const devConfig = { port: 3000 };
const prodConfig = { port: 4000 };
```

After that create the provider with useFactory

```typescript
@Module({
    providers: [
        {
            provide: 'CONFIG',
            useFactory: () => {
                return process.env.NODE_ENV === 'development' ? devConfig : prodConfig;
            }
        }
    ]
})
export class AppModule {}
```

After it you need to inject the prop

```typescript
@Injectable()
export class AppService {
    constructor(
        private devConfigService: DevConfigService,
        @Inject('CONFIG')
        private config: { port: string }
    ) {}

    getHello(): string {
        return `Hello, here is the db host (?): ${this.devConfigService.getDbHost()}, on port ${this.config.port}`
    }
}
```