import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Artist } from '../artists/artist.entity';
import { Playlist } from '../playlists/playlist.entity';

@Entity('songs')
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({type: 'date'})
    releasedDate: Date;

    @Column({type: 'time'})
    duration: Date;

    @Column({type: 'text', nullable: true})
    lyrics: string;

    @ManyToMany(() => Artist, (artist) => artist.songs, {cascade: true})
    @JoinTable({ name: 'songs_artists' })
    artists: Artist[];

    @ManyToOne(() => Playlist, (playlist) => playlist.songs)
    playlist: Playlist;
}