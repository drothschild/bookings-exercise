import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SelectMenu } from './FilterStyles';

const Title = styled.h4`
    color: #333;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.92px;
    text-transform: uppercase;
`;

export default class EmployeeFilter extends Component {
    render() {
        const {
            employees,
            deals,
            pricings,
            serviceFilter,
            employeeFilter,
            setEmployeeFilter
        } = this.props;
        const isDisabledEmployee = employee => {
            if (parseInt(serviceFilter) === -1) {
                return false;
            }
            const id = employee.id;
            const deal = deals.find(
                deal => deal.id === parseInt(serviceFilter)
            );
            return (
                deal.variations.filter(variation => {
                    return (
                        pricings.filter(pricing => {
                            return (
                                pricing.variation_id === variation.id &&
                                pricing.employee_id === id
                            );
                        }).length > 0
                    );
                }).length === 0
            );
        };

        return (
            <div>
                <SelectMenu>
                    <Title>Filter by Staff Member</Title>
                    <input
                        id="employee-1"
                        type="radio"
                        name="employeeFilter"
                        value={-1}
                        onChange={e => {
                            setEmployeeFilter(e.target.value);
                        }}
                        checked={parseInt(employeeFilter) === -1}
                    />
                    <label htmlFor="employee-1">
                        <div className="option">All Staff Members</div>
                    </label>
                    {employees.map(employee => {
                        const { id, name } = employee;
                        return (
                            <React.Fragment key={id}>
                                <input
                                    id={id}
                                    type="radio"
                                    name="employeeFilter"
                                    value={id}
                                    onChange={e => {
                                        setEmployeeFilter(e.target.value);
                                    }}
                                    checked={parseInt(employeeFilter) === id}
                                    disabled={isDisabledEmployee(employee)}
                                />
                                <label htmlFor={id}>
                                    <div className="option">{name}</div>
                                </label>
                            </React.Fragment>
                        );
                    })}
                </SelectMenu>
            </div>
        );
    }
}
