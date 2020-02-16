import React from 'react'
import PropTypes from 'prop-types'

import { FaCompass, FaBriefcase, FaUsers, FaUserFriends, FaCode, FaUser } from 'react-icons/fa'
import { battle } from "../utils/api.js";
import { Card } from "./Card.jsx";
import Loading from "./Loading.jsx";
import Tooltip from "./Tooltip.jsx";
import {Link} from "react-router-dom";
import queryString from "query-string";

const ProfileList = ({ profile }) => {
    return (
        <ul className='card-list'>
            <li>
                <FaUser color='rgb(239, 115, 115)' size={22} />
                {profile.name}
            </li>
            {profile.location && (
                <li>
                    <Tooltip text={"User's location"}>
                        <FaCompass color='rgb(144, 115, 255)' size={22} />
                        {profile.location}
                    </Tooltip>
                </li>
            )}
            {profile.company && (
                <li>
                    <Tooltip text={"User's company"}>
                        <FaBriefcase color='#795548' size={22} />
                        {profile.company}
                    </Tooltip>
                </li>
            )}
            <li>
                <FaUsers color='rgb(129, 195, 245)' size={22} />
                {profile.followers.toLocaleString()} followers
            </li>
            <li>
                <FaUserFriends color='rgb(64, 183, 95)' size={22} />
                {profile.following.toLocaleString()} following
            </li>
        </ul>
    );
};

ProfileList.propTypes = {
    profile: PropTypes.object.isRequired
};

export default class Results extends React.Component {

    state = {
        winner: null,
        loser: null,
        error: null,
        isLoading: true
    }

    componentDidMount() {
        const {playerOne, playerTwo} = queryString.parse(this.props.location.search);
        battle([playerOne, playerTwo])
            .then(results => {
                this.setState({
                    winner: results[0],
                    loser: results[1],
                    error: null,
                    isLoading: false
                })
            })
            .catch(({ message }) => {
               this.setState({
                   error: message,
                   isLoading: false
               })
            });

    }


    render() {
        const { winner, loser, error, isLoading } = this.state;


        if(isLoading === true) {
            return (
                <Loading text={'Battle'}/>
            );
        }

        if (error) {
            return (
                <p className='center-text error'>{error}</p>
            )
        }

        return (
            <>
                <div className='grid space-around container-sm'>
                    <Card
                        header={`${winner.score === loser.score ? 'Tie' : 'Winner'}`}
                        avatar={winner.profile.avatar_url}
                        href={winner.profile.html_url}
                        subheader={`Score: ${winner.score.toLocaleString()}`}
                        name={winner.profile.login}
                    >
                        <ProfileList profile={winner.profile}/>
                    </Card>

                    <Card
                        header={`${winner.score === loser.score ? 'Tie' : 'Loser'}`}
                        avatar={loser.profile.avatar_url}
                        href={loser.profile.html_url}
                        subheader={`Score: ${loser.score.toLocaleString()}`}
                        name={loser.profile.login}
                    >
                        <ProfileList profile={loser.profile}/>
                    </Card>

                </div>
                <Link
                    className='btn dark-btn btn-space'
                    to='/battle'>
                    Reset
                </Link>
            </>
        )
    }
}
