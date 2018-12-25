import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from '@reach/router';

import { STATES } from '../defaults';

const StateList = styled.ul`
    display: flex;
    flex-direction: column;
    list-style: none;
    width: 100%;
`;
const StateItem = styled.li`
    display: flex;
    align-items: top;
    .state-name {
        text-transform: uppercase;
        font-size: 12px;
    }
`;
const LocationsForState = styled.ul`
    display: flex;
    flex-direction: column;
    list-style: none;
    width: 70%;
`;

const LocationItem = styled.li`
    display: flex;
    .city-name {
        color: ${props => props.theme.blue};
    }
    .address {
    }
`;

export default function LocationsList({ locations }) {
    const states = locations
        .map(location => {
            return location.state;
        })
        .filter((state, index, self) => {
            return self.indexOf(state) === index;
        })
        .sort();
    const fullStateName = state => {
        return STATES[state] || state;
    };
    const locationsForState = state => {
        return locations
            .filter(location => {
                return location.state === state;
            })
            .sort((a, b) => {
                return a.zip > b.zip;
            });
    };

    return (
        <StateList>
            {states.map(state => {
                return (
                    <StateItem key={state}>
                        <div className="state-name">{fullStateName(state)}</div>
                        <LocationsForState>
                            {locationsForState(state).map(loc => {
                                const {
                                    id,
                                    city,
                                    street_address,
                                    zip_code
                                } = loc;
                                return (
                                    <LocationItem key={id}>
                                        <Link to={`/${id}`}>{city}</Link> -{' '}
                                        {street_address} {zip_code}
                                    </LocationItem>
                                );
                            })}
                        </LocationsForState>
                    </StateItem>
                );
            })}
        </StateList>
    );
}
