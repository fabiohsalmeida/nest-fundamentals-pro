import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './create-artist-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ArtistsService {
    constructor(
        @InjectRepository(Artist)
        private artistsRepository: Repository<Artist>
    ) {}

    async createArtist(artistDto: CreateArtistDto) {
        const artist = new Artist();
        artist.name = artistDto.name

        return await this.artistsRepository.save(artist);
    }
    async getPaginatedArtists(options: IPaginationOptions) : Promise<Pagination<Artist>> {
        return await paginate<Artist>(this.artistsRepository, options);
    }
}
