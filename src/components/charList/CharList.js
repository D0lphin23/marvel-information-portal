import { Component } from "react";
import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

class CharList extends Component {
    state = {
        chars: [],
        limit: 9,
        loading: true,
        error: false,
    };

    marvelServices = new MarvelService();

    componentDidMount() {
        this.updateChars();
    }

    onCharsLoaded = (chars) => {
        this.setState({ chars, loading: false });
    };

    onError = () => {
        this.setState({ loading: false, error: true });
    };

    updateChars = () => {
        const limit = this.state.limit;

        this.marvelServices
            .getAllCharacters(limit)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    };

    onLoadMore = () => {
        const { limit } = this.state;
        if (limit >= 20) return;

        this.setState({ limit: limit + 3 }, this.updateChars);
    };

    render() {
        const { chars, loading, error } = this.state;
        const errorMesssage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? (
            <ViewChars
                chars={chars}
                onCharSelected={this.props.onCharSelected}
            />
        ) : null;

        const gridClass = `char__grid ${loading ? "char__grid_loading" : ""}`;

        return (
            <div className="char__list">
                <ul className={gridClass}>
                    {errorMesssage || spinner || content}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner" onClick={this.onLoadMore}>
                        load more
                    </div>
                </button>
            </div>
        );
    }
}

const ViewChars = ({ chars, onCharSelected }) => {
    const charsList = chars.map((char) => {
        const { id, name, thumbnail } = char;

        return (
            <li
                key={id}
                className="char__item"
                onClick={() => {
                    onCharSelected(id);
                }}
            >
                <img src={thumbnail} alt={name} />
                <div className="char__name">{name}</div>
            </li>
        );
    });

    return charsList;
};

export default CharList;
