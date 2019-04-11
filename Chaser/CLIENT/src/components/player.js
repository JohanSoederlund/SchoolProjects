import React from 'react';

export default class Player extends React.Component {
    render() {
        return (
        <div className="player" style={this.props.style}>
            {this.props.playerRole}:  {this.props.name}
        </div>
        );
    }
}