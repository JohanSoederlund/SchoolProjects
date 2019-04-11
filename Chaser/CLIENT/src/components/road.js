import React from 'react';
import { RSA_NO_PADDING } from 'constants';


export default class Road extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.direction}
            />
        );
    }
}