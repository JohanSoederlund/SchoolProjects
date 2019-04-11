import React from 'react';

import GamePiece from './gamePiece';

export default class GamePieces extends React.Component {
    renderGamePiece(i) {
        return (
          <GamePiece
            value={this.props.gamePieces[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
    }

    render() {
        return (
            <div className="side-info" >
                <div className="board-row">
                {this.renderGamePiece(0)}
                {this.renderGamePiece(1)}
                {this.renderGamePiece(2)}
                {this.renderGamePiece(3)}
                </div>                  
            </div>
        );
    }
}