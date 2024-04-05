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