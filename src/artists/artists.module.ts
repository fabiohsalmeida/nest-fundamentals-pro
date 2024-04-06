import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Artist])
    ],
    controllers: [ArtistsController],
    providers: [ArtistsService],
    exports: [ArtistsService]
})
export class ArtistsModule {}
