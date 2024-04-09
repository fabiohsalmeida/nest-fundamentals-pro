import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Song } from '../songs/song.entity';
import { User } from '../users/user.entity';

@Entity('playlist')
export class Playlist {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @OneToMany(() => Song, (song) => song.playlist)
    songs: Song[];

    @ManyToOne(() => User, (user) => user.playlists)
    user: User;

}