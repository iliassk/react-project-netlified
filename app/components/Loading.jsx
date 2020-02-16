import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    content: {
        fontSize: '35px',
        position: 'absolute',
        left: '0',
        right: '0',
        marginTop: '20px',
        textAlign: 'center'
    }
}

export default class Loading extends React.Component {
    state = {
        content: this.props.text
    };

    componentDidMount() {
        const { text, speed } = this.props;

        this.callbackInterval =
            window.setInterval(() => {
                this.state.content === `${text}...`
                    ?
                    this.state.content = text
                    :
                    this.setState(({ content }) => ({
                        content: `${content}.`
                    }))
            }, speed)
    }

    componentWillUnmount() {
        window.clearInterval(this.callbackInterval);
    }

    render() {
        const { content } = this.state;
        return (
            <p style={styles.content}>
                {content}
            </p>
        );
    }


}

Loading.propTypes = {
    text: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired
};

Loading.defaultProps = {
    text: 'Loading',
    speed: 300
};
