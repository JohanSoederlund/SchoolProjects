import React from 'react';

export default class GamePiece extends React.Component {

    render() {
        return (
            <button className="gamePiece" style={this.props.value} onClick={this.props.onClick}>
                {this.props.value.text}
            </button>
        );
    }   
}   