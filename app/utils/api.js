
const getErrorMessage = (errorMessage, username) => {
    if(errorMessage === "Not Found") {
        return `${username} does not exist`;
    }

    return errorMessage;
};

const getProfile = (username) => {
    return fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then(profile => {
            if(profile.message) {
                throw new Error(getErrorMessage(profile.message, username))
            }
            return profile
        });
};

const getRepos = (username) => {
    return fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
        .then((response) => response.json())
        .then(repos => {
            if(repos.message) {
                throw new Error(getErrorMessage(repos.message, username))
            }
            return repos
        });
};

const getStarCount = (repos) => {
    return repos.reduce((count, { stargazers_count }) => count + stargazers_count, 0)
};

const calculateScore = (followers, repos) => {
    return (followers * 3) + getStarCount(repos);
};

const getUserData = (username) => {
    return Promise.all([getProfile(username), getRepos(username)])
        .then(([profile, repos]) => ({
            profile,
            score: calculateScore(profile.followers, repos)
        }));
};

const sortPlayers = (players) => {
    return players.sort((a, b) => b.score - a.score);
}

export const battle = (players) => {
    return Promise.all([getUserData(players[0]), getUserData(players[1])])
        .then((results) => sortPlayers(results))
};

export const fetchPopularRepos = (language) => {
    const endpoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)

    return fetch(endpoint)
        .then(result => result.json())
        .then(data => {
            if(!data.items) {
                throw new Error("Could not fetch popular repos from Github");
            }
            return data.items;
        })
}
