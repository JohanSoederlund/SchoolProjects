import React from 'react';

import Square from './square';
import Road from './road';

export default class Board extends React.Component {
    renderSquare(i) {
      return (
        
        <Square
          key={i.toString()} 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
    renderRow(rows, columns) {
        var row = [];
        for (var i = 0; i < columns; i++) {
            row.push(this.renderSquare(i+rows*12));
            if (i < 11) {
                row.push(this.renderRoad(i+rows*12, "horizontal"));
            }
        }
        return row;
    }

    renderRoad(i, direction) {
        return (
            <Road 
                direction={direction}
            />
        );
      }
    renderRoads(rows, columns) {
        var row = [];
        for (var i = 0; i < columns; i++) {
            row.push(this.renderRoad(i+rows*12, "vertical"));
        }
        return row;
    }

    render() {
      return (
        <div>
          <div className="board-row" >
            {this.renderRow(0,12)}
            <div className="g-block"></div>
            {this.renderRoads(0,11)}
          </div>
          <div className="board-row">
            {this.renderRow(1,12)}
            <div className="g-block"></div>
            {this.renderRoads(1,11)}
          </div>
          <div className="board-row">
            {this.renderRow(2,12)}
            <div className="g-block"></div>
            {this.renderRoads(2,11)}
          </div>
          <div className="board-row">
            {this.renderRow(3,12)}
            <div className="g-block"></div>
            {this.renderRoads(3,11)}
          </div>
          <div className="board-row">
            {this.renderRow(4,12)}
            <div className="g-block"></div>
            {this.renderRoads(4,11)}
          </div>
          <div className="board-row">
            {this.renderRow(5,12)}
            <div className="g-block"></div>
            {this.renderRoads(5,11)}
          </div>
          <div className="board-row">
            {this.renderRow(6,12)}
            <div className="g-block"></div>
            {this.renderRoads(6,11)}
          </div>
          <div className="board-row">
            {this.renderRow(7,12)}
            <div className="g-block"></div>
            {this.renderRoads(7,11)}
          </div>
          <div className="board-row">
            {this.renderRow(8,12)}
            <div className="g-block"></div>
            {this.renderRoads(8,11)}
          </div>
          <div className="board-row">
            {this.renderRow(9,12)}
            <div className="g-block"></div>
            {this.renderRoads(9,11)}
          </div>
          <div className="board-row">
            {this.renderRow(10,12)}
            <div className="g-block"></div>
            {this.renderRoads(10,11)}
          </div>
          <div className="board-row">
            {this.renderRow(11,12)}
          </div>
        </div>
      );

    }
  }