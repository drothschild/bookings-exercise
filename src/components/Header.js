import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export default class Header extends Component {
    static propTypes = {
        company: PropTypes.object
    };
    render() {
        const { company } = this.props;
        const { marketing_logo: logo = null } = company;
        return (
            <div>
                <img src={logo.original} alt={`${company.name} logo`} />
                <div>{company.name}</div>
            </div>
        );
    }
}
