import { Song } from "src/songs/song.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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