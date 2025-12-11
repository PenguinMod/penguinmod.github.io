import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {setUsername, setUsernameInvalid, setUsernameLoggedIn} from '../reducers/tw';

let origin = "https://penguinmod.com";
origin = 'http://localhost:5173';

class HomeCommunication extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'wrapperEventHandler'
        ]);
        
        this.state = {
            frame: null,
            canSetUsername: true,
        };
    }
    
    componentDidMount() {
        window.addEventListener('message', this.wrapperEventHandler);
        const iframe = document.createElement('iframe');
        iframe.src = `${origin}/embed/editor?external=${encodeURIComponent(window.origin)}`;
        iframe.width = 100;
        iframe.height = 100;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        this.setState({
            frame: iframe
        });
    }
    componentWillUnmount() {
        window.removeEventListener('message', this.wrapperEventHandler);
        const iframe = this.state.frame;
        if (iframe) {
            iframe.remove();
        }
        this.setState({
            frame: null
        });
    }
    
    async wrapperEventHandler(e) {
        const data = e.data;
        // Don't recursively try to run this event.
        if (e.origin === window.origin) {
            return;
        }
        if (!data.type) return;
        if (!data.packet) return;

        switch (data.type) {
            case 'login': {
                if (data.packet.loggedIn !== true) return;
                if (!data.packet.username) return;
                if (!this.state.canSetUsername) return;
                this.props.onSetUsername(data.packet.username);
                this.setState({
                    canSetUsername: false
                });
            }
        }
    }

    render () {
        return (
            <div></div>
        );
    }
}

HomeCommunication.propTypes = {
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isPlayground: PropTypes.bool,
    onSetUsername: PropTypes.func,
    username: PropTypes.string,
    usernameInvalid: PropTypes.bool,
    usernameLoggedIn: PropTypes.bool
};

const mapStateToProps = state => ({
    username: state.scratchGui.tw.username,
    usernameInvalid: state.scratchGui.tw.usernameInvalid,
    usernameLoggedIn: state.scratchGui.tw.usernameLoggedIn
});

const mapDispatchToProps = dispatch => ({
    onSetUsername: username => {
        dispatch(setUsername(username));
        dispatch(setUsernameLoggedIn(true));
        dispatch(setUsernameInvalid(false));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeCommunication);
