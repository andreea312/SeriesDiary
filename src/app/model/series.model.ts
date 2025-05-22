export class Series {
    tmdb_id: number;
    name: string;
    keywords?: string | null;
    airing_date?: number | null;
    poster_img_url?: string;
    cast?: string | null;
    genres?: string | null;
    number_of_seasons?: number | null;
    number_of_episodes?: number | null;
    synopsis?: string | null;
    average_rating?: number | null;
    rating_count?: number | null;

    constructor(data: Partial<Series>) {
        this.tmdb_id = data.tmdb_id ?? 0;
        this.name = data.name ?? '';
        this.keywords = data.keywords ?? null;
        this.airing_date = data.airing_date ?? null;
        this.poster_img_url = data.poster_img_url ?? '';
        this.cast = data.cast ?? null;
        this.genres = data.genres ?? null;
        this.number_of_seasons = data.number_of_seasons ?? null;
        this.number_of_episodes = data.number_of_episodes ?? null;
        this.synopsis = data.synopsis ?? null;
        this.average_rating = data.average_rating ?? null;
        this.rating_count = data.rating_count ?? null;
    }
}