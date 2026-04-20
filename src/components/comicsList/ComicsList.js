import { useState, useEffect } from "react";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./comicsList.scss";

const ComicsList = ({ onComicsSelected }) => {
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
        getAllComics(offset).then(onComicsLoaded);
    };

    const onComicsLoaded = (newComics) => {
        let ended = false;
        if (newComics.length < 8) {
            ended = true;
        }

        setComics((comics) => [...comics, ...newComics]);
        setNewItemsLoading(false);
        setComicsEnded(ended);
        setOffset((offset) => offset + 8);
    };

    const ViewComics = (comics) => {
        const comicsList = comics.map((comics) => {
            const { id, title, thumbnail, price } = comics;

            return (
                <li
                    key={id}
                    tabIndex={0}
                    className="comics__item"
                    onClick={() => onComicsSelected(id)}
                    onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                            onComicsSelected(id);
                        }
                    }}
                >
                    <a href="#">
                        <img
                            src={thumbnail}
                            alt={title}
                            className="comics__item-img"
                        />
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </a>
                </li>
            );
        });

        return comicsList;
    };

    const comicsItems = ViewComics(comics);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemsLoading ? <Spinner /> : null;

    const gridClass = `comics__grid ${loading && !newItemsLoading ? "comics__grid_loading" : ""}`;

    return (
        <div className="comics__list">
            <ul className={gridClass}>
                {errorMessage || spinner || comicsItems}
            </ul>
            <button
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{ display: comicsEnded ? "none" : "block" }}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

export default ComicsList;
