import React from 'react';
import PropTypes from 'prop-types';
import { fetchPopularRepos } from "../utils/api";
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
import { Card } from "./Card.jsx";
import Loading from "./Loading.jsx";
import Tooltip from "./Tooltip.jsx";

const LanguagesNav = ({ selected, onUpdateLanguage }) => {
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
    return (
        <ul className='flex-center'>
            {languages.map((language) => (
                <li key={language}>
                    <button
                        className='btn-clear nav-link'
                        style={selected === language ? {color: 'red'} : null}
                        onClick={() => onUpdateLanguage(language)}>
                        {language}
                    </button>
                </li>
            ))}
        </ul>
    )
}

function ReposGrid ({ repos }) {
    return (
        <ul className='grid space-around'>
            {repos.map((repo, index) => {
                const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
                const { login, avatar_url } = owner

                return (
                    <li key={html_url}>
                        <Card
                            header={`#${index + 1}`}
                            avatar={avatar_url}
                            href={`https://github.com/${login}`}
                            name={login}
                        >
                            <ul className='card-list'>
                                <li>
                                    <Tooltip text={"Github username"}>
                                        <FaUser color='rgb(255, 191, 116)' size={22} />
                                        <a href={`https://github.com/${login}`}>
                                            {login}
                                        </a>
                                    </Tooltip>
                                </li>
                                <li>
                                    <FaStar color='rgb(255, 215, 0)' size={22} />
                                    {stargazers_count.toLocaleString()} stars
                                </li>
                                <li>
                                    <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                                    {forks.toLocaleString()} forks
                                </li>
                                <li>
                                    <FaExclamationTriangle color='rgb(241, 138, 147)' size={22} />
                                    {open_issues.toLocaleString()} open
                                </li>
                            </ul>
                        </Card>
                    </li>

                )
            })}
        </ul>
    )
}

LanguagesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
};

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
};

export default class Popular extends React.Component {
    state = {
        selectedLanguage: 'All',
        repos: {},
        error: null
    };

    componentDidMount() {
        this.updateLanguage(this.state.selectedLanguage)
    }

    isLoading = () => {
        const { selectedLanguage, repos, error } = this.state;
        return !repos[selectedLanguage] && error === null;
    };

    updateLanguage = (selectedLanguage) => {
        this.setState({
            selectedLanguage,
            error: null
        });

        if(!this.state.repos[selectedLanguage]) {
            fetchPopularRepos(selectedLanguage)
                .then(data => {
                    this.setState(({repos}) => {
                        return {
                            repos: {
                                ...repos,
                                [selectedLanguage]: data
                            },
                            error: null
                        }
                    })
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({
                        error: error.message
                    })
                });
        }

    };

    render() {
        const { selectedLanguage, repos, error } = this.state
        return (
            <React.Fragment>
                <LanguagesNav
                    selected={selectedLanguage}
                    onUpdateLanguage={this.updateLanguage}
                />
                {this.isLoading() && <Loading text={'Fetching repos'} />}
                {error && <p className='center-text error'>{error}</p>}
                {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]} />}
            </React.Fragment>
        )
    }
}
