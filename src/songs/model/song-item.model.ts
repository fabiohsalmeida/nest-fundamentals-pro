export class SongItem {
    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }

    readonly id: number;
    readonly title: string;
}