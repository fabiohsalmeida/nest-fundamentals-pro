import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Song } from "../songs/song.entity";
import { User } from "../users/user.entity";

@Entity('artist')
export class Artist {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @ManyToMany(() => Song, (song) => song.artists)
    songs: Song[];
}