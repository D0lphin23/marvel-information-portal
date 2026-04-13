import { Component } from "react";
import PropTypes from "prop-types";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

class CharList extends Component {
    state = {
        chars: [],
        offset: 0,
        loading: true,
        error: false,
        newItemsLoading: false,
        charEnded: false,
    };

    marvelServices = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelServices
            .getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    };

    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true,
        });
    };

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({ offset, chars }) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemsLoading: false,
            charEnded: ended,
            offset: offset + 9,
        }));
    };

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        });
    };

    itemRefs = [];

    setCharRef = (ref) => {
        this.itemRefs.push(ref);
    };

    onSelectedChar = (id) => {
        if (this.itemRefs.length > 0) {
            this.itemRefs.forEach((item) =>
                item.classList.remove("char__item_selected"),
            );
            const selectedItem = this.itemRefs[id];

            if (selectedItem) {
                selectedItem.classList.add("char__item_selected");
                selectedItem.focus();
            }
        }
    };

    render() {
        const { chars, loading, error, newItemsLoading, offset, charEnded } =
            this.state;
        const errorMesssage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? (
            <ViewChars
                chars={chars}
                onCharSelected={this.props.onCharSelected}
                setCharRef={this.setCharRef}
                onSelectedChar={this.onSelectedChar}
            />
        ) : null;

        const gridClass = `char__grid ${loading ? "char__grid_loading" : ""}`;

        return (
            <div className="char__list">
                <ul className={gridClass}>
                    {errorMesssage || spinner || content}
                </ul>
                <button
                    className="button button__main button__long"
                    disabled={newItemsLoading}
                    style={{ display: charEnded ? "none" : "block" }}
                    onClick={() => this.onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
}

const ViewChars = ({ chars, onCharSelected, setCharRef, onSelectedChar }) => {
    const charsList = chars.map((char, i) => {
        const { id, name, thumbnail } = char;

        return (
            <li
                key={id}
                tabIndex={0}
                ref={setCharRef}
                className="char__item"
                onClick={() => {
                    onCharSelected(id);
                    onSelectedChar(i);
                }}
                onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                        onCharSelected(id);
                        onSelectedChar(i);
                    }
                }}
            >
                <img src={thumbnail} alt={name} />
                <div className="char__name">{name}</div>
            </li>
        );
    });

    return charsList;
};

CharList.propTypes = {
    onCharSelected: PropTypes.func,
};

export default CharList;
