import React from 'react';

// import './index.css';

export default class Square extends React.Component {

    render() {
        return (
            <button className="square"  style={this.props.value} onClick={this.props.onClick}>
                {this.props.value.text}
            </button>
        );
    }
}
