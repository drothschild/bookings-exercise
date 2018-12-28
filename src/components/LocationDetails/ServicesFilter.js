import React, { Component } from 'react';
import styled from 'styled-components';
import { SelectMenu } from './FilterStyles';

const Title = styled.h4`
    color: #333;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.92px;
    text-transform: uppercase;
`;

export default class ServicesFilter extends Component {
    render() {
        const {
            deals,
            pricings,
            serviceFilter,
            employeeFilter,
            setServiceFilter
        } = this.props;
        const isDisabledService = deal => {
            return (
                parseInt(employeeFilter) !== -1 &&
                deal.variations.filter(variation => {
                    return (
                        pricings.filter(pricing => {
                            return (
                                pricing.variation_id === variation.id &&
                                pricing.employee_id === parseInt(employeeFilter)
                            );
                        }).length > 0
                    );
                }).length === 0
            );
        };

        const numberOfServicesOffered = deal => {
            if (parseInt(employeeFilter) === -1) {
                return deal.variations.length;
            } else {
                return deal.variations.reduce((total, variation) => {
                    return (
                        total +
                        pricings.filter(pricing => {
                            return (
                                pricing.variation_id === variation.id &&
                                pricing.employee_id === parseInt(employeeFilter)
                            );
                        }).length
                    );
                }, 0);
            }
        };

        const totalServicesOffered = deals.reduce((total, deal) => {
            return total + numberOfServicesOffered(deal);
        }, 0);

        return (
            <div>
                <Title>Filter By Service</Title>
                <SelectMenu>
                    <input
                        id="service-1"
                        type="radio"
                        name="serviceFilter"
                        value={-1}
                        onChange={e => {
                            setServiceFilter(e.target.value);
                        }}
                        checked={parseInt(serviceFilter) === -1}
                    />
                    <label htmlFor="service-1">
                        <div className="option">All Services</div>
                        <div className="details">
                            {totalServicesOffered} Services
                        </div>
                    </label>
                    {deals.map(deal => {
                        const { id, service } = deal;
                        return (
                            <React.Fragment key={id}>
                                <input
                                    id={id}
                                    type="radio"
                                    name="serviceFilter"
                                    value={id}
                                    onChange={e => {
                                        setServiceFilter(e.target.value);
                                    }}
                                    checked={parseInt(serviceFilter) === id}
                                    disabled={isDisabledService(deal)}
                                />
                                <label htmlFor={id}>
                                    <div className="option">{service.name}</div>
                                    <div className="details">
                                        {numberOfServicesOffered(deal)} Services
                                    </div>
                                </label>
                            </React.Fragment>
                        );
                    })}
                </SelectMenu>
            </div>
        );
    }
}
