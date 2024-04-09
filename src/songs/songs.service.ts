import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";
import { Repository, In, UpdateResult } from "typeorm";
import { Artist } from "../artists/artist.entity";
import { CreateSongRequestDto } from "./dto/request/create-song-request.dto";
import { UpdateSongRequestDto } from "./dto/request/update-song-request.dto";
import { CreateSongResponseDto } from "./dto/response/create-song-response.dto";
import { GetAllSongsResponseDto } from "./dto/response/get-all-songs-response.dto";
import { SongItem } from "./model/song-item.model";
import { Song } from "./song.entity";


@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(Song)
        private songsRepository: Repository<Song>,
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>
    ) {}

    private readonly songs = []

    async create(songDto: CreateSongRequestDto) : Promise<CreateSongResponseDto> {
        const song = new Song();
        song.title = songDto.title;
        song.duration = songDto.duration;
        song.lyrics = songDto.lyrics;
        song.releasedDate = songDto.releasedDate;

        const artists = await this.artistRepository.findBy({id: In(songDto.artists)});
        song.artists = artists;

        const createdSong = await this.songsRepository.save(song);

        return new CreateSongResponseDto(createdSong.id);
    }

    async findAll() : Promise<GetAllSongsResponseDto> {
        const songList: Song[] = await this.songsRepository.find();
        const songItemList = songList.map(s => new SongItem(s.id, s.title));

        return new GetAllSongsResponseDto(songItemList);
    }

    async findById(id: number) : Promise<Song> {
        return await this.songsRepository.findOneBy({id});
    }

    async update(id: number, recordToUpdate: UpdateSongRequestDto): Promise<UpdateResult> {
        return await this.songsRepository.update(id, recordToUpdate);
    }

    async deleteById(id: number) : Promise<void> {
        await this.songsRepository.delete({id});
    }

    async paginate(options: IPaginationOptions) : Promise<Pagination<Song>> {
        return paginate<Song>(this.songsRepository, options);
    }

    async paginateAndOrder(options: IPaginationOptions) : Promise<Pagination<SongItem>> {
        const queryBuilder = this.songsRepository.createQueryBuilder('c');
        queryBuilder.orderBy('c.releasedDate', 'DESC');
        const results = await paginate<SongItem>(queryBuilder, options)

        return new Pagination(
            results.items.map((item: Song) => new SongItem(item.id, item.title)),
            results.meta,
            results.links
        )
    }

    // async paginateAndOrder(options: IPaginationOptions) : Promise<Pagination<SongItem>> {
    //     const queryBuilder = this.songsRepository.createQueryBuilder('c');
    //     queryBuilder.orderBy('c.releasedDate', 'DESC');
        
    //     return (await paginate<SongItem>(queryBuilder, options))
    // }
}
