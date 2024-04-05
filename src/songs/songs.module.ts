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
