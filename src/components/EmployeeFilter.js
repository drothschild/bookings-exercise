import React from 'react';
import PropTypes from 'prop-types';
import { SelectMenu, SectionTitle } from './styles';

const EmployeeFilter = ({
    employees,
    employeeFilter,
    setEmployeeFilter,
    isDisabledEmployee
}) => (
    <div>
        <SectionTitle>Filter by Staff Member</SectionTitle>
        <SelectMenu>
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

EmployeeFilter.propTypes = {
    employees: PropTypes.array,
    employeeFilter: PropTypes.number.isRequired,
    setEmployeeFilter: PropTypes.func.isRequired,
    isDisabledEmployee: PropTypes.func.isRequired
};

export default EmployeeFilter;
