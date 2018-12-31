import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from '@reach/router';
import { STATES } from '../defaults';
import { Main, MainTitle } from './styles';

const StateList = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;
const StateItem = styled.div`
    display: flex;
    align-items: top;
    .state-name {
        text-transform: uppercase;
        font-size: 12px;
        width: 10%;
        margin: 0;
        white-space: nowrap;
    }
`;
const LocationsForState = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
`;

const LocationItem = styled.li`
    display: flex;
    .city-name {
        font-size: 14px;
        font-style: bold;
        text-decoration: none;
        color: ${props => props.theme.blue};
        width: 30%;
        font-weight: 400;
    }
    .address {
    }
`;

const LocationsList = ({ locations }) => {
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
                return a.zip_code - b.zip_code;
            });
    };

    return (
        <Main>
            <MainTitle>Pick a location</MainTitle>
            <StateList>
                {states.map(state => {
                    return (
                        <StateItem key={state}>
                            <h3 className="state-name">
                                {fullStateName(state)}
                            </h3>

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
                                            <div className="city-name">
                                                {' '}
                                                <Link to={`/${id}`}>
                                                    {city}
                                                </Link>
                                            </div>{' '}
                                            <div>
                                                {street_address} {zip_code}
                                            </div>
                                        </LocationItem>
                                    );
                                })}
                            </LocationsForState>
                        </StateItem>
                    );
                })}
            </StateList>
        </Main>
    );
};

LocationsList.propTypes = {
    location: PropTypes.array
};

export default LocationsList;
