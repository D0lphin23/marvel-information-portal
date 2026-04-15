import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

const CharList = (props) => {
    const [chars, setChars] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const marvelServices = new MarvelService();

    useEffect(() => {
        onRequest();
    }, []);

    const onRequest = (offset) => {
        onCharListLoading();
        marvelServices
            .getAllCharacters(offset)
            .then(onCharsLoaded)
            .catch(onError);
    };

    const onCharListLoading = () => {
        setNewItemsLoading(true);
    };

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChars((chars) => [...chars, ...newChars]);
        setLoading(false);
        setNewItemsLoading((newItemsLoading) => false);
        setCharEnded((charEnded) => ended);
        setOffset((offset) => offset + 9);
    };

    const onError = () => {
        setLoading(false);
        setError(true);
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
                        props.onCharSelected(id);
                        focusOnItem(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                            props.onCharSelected(id);
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
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    const gridClass = `char__grid ${loading ? "char__grid_loading" : ""}`;

    return (
        <div className="char__list">
            <ul className={gridClass}>{errorMessage || spinner || content}</ul>
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
