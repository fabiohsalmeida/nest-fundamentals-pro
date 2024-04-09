import { SongItem } from "src/songs/model/song-item.model";

export class GetAllSongsResponseDto {
    constructor(songs: SongItem[]) {
        this.songs = songs;
    }

    readonly songs: SongItem[];
}