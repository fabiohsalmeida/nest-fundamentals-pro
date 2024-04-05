import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
    // local db
    // local array
    private readonly songs = []

    create(song) {
        this.songs.push(song)
    }

    findAll() {
        throw new Error('Error in db while fetching record');

        return this.songs;
    }
}
