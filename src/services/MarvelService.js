import ironMan from "../resources/img/ironMan.jpg";

class MarvelService {
    _apiBase = "https://marvel-server-zeta.vercel.app/";
    _apiKey = "apikey=d4eecb0c66dedbfae4eab45d312fc1df";
    _limit = 20;

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getAllCharacters = async (limit = this._limit) => {
        const res = await this.getResource(
            `${this._apiBase}characters?limit=${limit}&${this._apiKey}`,
        );

        return res.data.results.map(this._transformCharacter);
    };

    getCharacter = async (id) => {
        const res = await this.getResource(
            `${this._apiBase}characters/${id}?${this._apiKey}`,
        );

        return this._transformCharacter(res.data.results[0]);
    };

    _transformCharacter = (char) => {
        const description =
            char?.description?.length > 235
                ? `${char?.description?.slice(0, 235)}...`
                : char?.description ||
                  "There is no description for this character";

        const thumbnail =
            char?.name === "Iron Man"
                ? ironMan
                : `${char.thumbnail.path}.${char.thumbnail.extension}`;

        return {
            id: char.id,
            name: char.name,
            description: description,
            thumbnail: thumbnail,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        };
    };
}

export default MarvelService;
