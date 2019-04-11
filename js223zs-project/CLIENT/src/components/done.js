import React from 'react';

export default class Done  extends React.Component {
    render() {
        return (
        <button className="done"  style={this.props.style} onClick={this.props.onClick}>
            {"DONE"}
        </button>
        );
    }
}