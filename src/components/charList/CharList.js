import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

const CharList = ({ onCharSelected }) => {
    const [chars, setChars] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const { loading, error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
        getAllCharacters(offset).then(onCharsLoaded);
    };

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChars((chars) => [...chars, ...newChars]);
        setNewItemsLoading(false);
        setCharEnded(ended);
        setOffset((offset) => offset + 9);
    };

    const itemRefs = useRef([]);

    const focusOnItem = (index) => {
        if (itemRefs.current.length > 0) {
            itemRefs.current.forEach((item) =>
                item.classList.remove("char__item_selected"),
            );
            const selectedItem = itemRefs.current[index];

            if (selectedItem) {
                selectedItem.classList.add("char__item_selected");
                selectedItem.focus();
            }
        }
    };

    const ViewChars = (chars) => {
        const charsList = chars.map((char, i) => {
            const { id, name, thumbnail } = char;

            return (
                <li
                    key={id}
                    tabIndex={0}
                    ref={(el) => (itemRefs.current[i] = el)}
                    className="char__item"
                    onClick={() => {
                        onCharSelected(id);
                        focusOnItem(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                            onCharSelected(id);
                            focusOnItem(i);
                        }
                    }}
                >
                    <img src={thumbnail} alt={name} />
                    <div className="char__name">{name}</div>
                </li>
            );
        });

        return <ul className="char__grid">{charsList}</ul>;
    };

    const items = ViewChars(chars);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemsLoading ? <Spinner /> : null;

    const gridClass = `char__grid ${loading && !newItemsLoading ? "char__grid_loading" : ""}`;

    return (
        <div className="char__list">
            <ul className={gridClass}>{errorMessage || spinner || items}</ul>
            <button
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{ display: charEnded ? "none" : "block" }}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

CharList.propTypes = {
    onCharSelected: PropTypes.func,
};

export default CharList;
