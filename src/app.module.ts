import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './songs/song.entity';
import { Artist } from './artists/artist.entity';
import { User } from './users/user.entity';
import { ArtistsModule } from './artists/artists.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        database: 'nest-spotify-like-project',
        host: 'localhost',
        port: 5432,
        username: 'myuser',
        password: 'secret',
        entities: [Song, Artist, User],
        // Never use in production it, it will erase part of database
        synchronize: true
      }
    ),
    SongsModule,
    ArtistsModule
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
