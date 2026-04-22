import { useHttp } from "../hooks/http.hook";
import ironMan from "../resources/img/ironMan.jpg";

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();

    const _apiBase = "https://marvel-server-zeta.vercel.app/";
    const _apiKey = "apikey=d4eecb0c66dedbfae4eab45d312fc1df";
    const _limitChar = 9;
    const _limitComics = 8;
    const _baseOffset = 0;

    const getAllCharacters = async (
        offset = _baseOffset,
        limit = _limitChar,
    ) => {
        const res = await request(
            `${_apiBase}characters?limit=${limit}&offset=${offset}&${_apiKey}`,
        );

        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);

        return _transformCharacter(res.data.results[0]);
    };

    const getAllComics = async (offset = _baseOffset, limit = _limitComics) => {
        const res = await request(
            `${_apiBase}comics?limit=${limit}&offset=${offset}&${_apiKey}`,
        );

        return res.data.results.map(_transformComics);
    };

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);

        return _transformComics(res.data.results[0]);
    };

    const _transformCharacter = (char) => {
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

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description:
                comics.description || "There is no description for this comics",
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
            pageCount: `${comics.pageCount} pages`,
            language: comics.textObjects.languages,
            price: `${comics.prices[0].price}$` || "Not available",
        };
    };

    return {
        loading,
        error,
        getAllCharacters,
        getCharacter,
        getAllComics,
        getComic,
        clearError,
    };
};

export default useMarvelService;
