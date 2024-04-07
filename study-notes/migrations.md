# Migrations

## Setting up

### Create the data source

Outside of src folder, create a new folder called db, inside of it a file named data-source.ts or whatever you want to:

```ts
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'myuser',
    password: 'secret',
    database: 'nest-spotify-clone',
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
    migrations: ['dist/db/migrations/*.js']
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
```

### Include it inside of app.module

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ArtistsModule } from './artists/artists.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    SongsModule,
    ArtistsModule,
    PlaylistsModule,
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log('dbName', dataSource.driver.database);
  }

  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); // op 1
    // consumer.apply(LoggerMiddleware).forRoutes({path: 'songs', method: RequestMethod.POST}); // op 2
    consumer.apply(LoggerMiddleware).forRoutes(SongsController); // op 3
  }
}
```

### Create the scripts
Inside of package.json create the following scripts:

*putting in json just to format it*

```json
{
    "typeorm": "npm run build && npx typeorm -d dist/db/data-source.js",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert"
}
```

## To execute:
### Create a migration
Whenever there's a change in a entity, run the following command:

``npm run migration:generate -- db/migrations/[migrationName]``

Example: ``npm run migration:generate -- db/migrations/create-user-table``

### To the migrations
Execute the command ``npm run migration:run``

### To revert a migration:run execution
Execute the command ``npm run migration:revert``