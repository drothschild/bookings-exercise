import React from 'react';
import PropTypes from 'prop-types';
import { SelectMenu, SectionTitle } from './styles';

const ServiceFilter = ({
    services,
    pricings,
    serviceFilter,
    employeeFilter,
    setServiceFilter
}) => {
    const isDisabledService = service => {
        return (
            parseInt(employeeFilter) !== -1 &&
            service.variations.filter(variation => {
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

    const numberOfVariationsOffered = service => {
        if (parseInt(employeeFilter) === -1) {
            return service.variations.length;
        } else {
            return service.variations.reduce((total, variation) => {
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

    const totalVariationsOffered = services.reduce((total, service) => {
        return total + numberOfVariationsOffered(service);
    }, 0);
    const sortedServices = services.sort((a, b) => {
        return a.sort_order - b.sort_order;
    });

    return (
        <div>
            <SectionTitle>Filter By Service</SectionTitle>
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
                        {totalVariationsOffered} Services
                    </div>
                </label>
                {sortedServices.map(service => {
                    const { id, service: inner } = service;
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
                                disabled={isDisabledService(service)}
                            />
                            <label htmlFor={id}>
                                <div className="option">{inner.name}</div>
                                <div className="details">
                                    {numberOfVariationsOffered(service)}{' '}
                                    Services
                                </div>
                            </label>
                        </React.Fragment>
                    );
                })}
            </SelectMenu>
        </div>
    );
};

ServiceFilter.propTypes = {
    services: PropTypes.array,
    pricings: PropTypes.array,
    serviceFilter: PropTypes.number.isRequired,
    employeeFilter: PropTypes.number.isRequired,
    setServiceFilter: PropTypes.func.isRequired
};

export default ServiceFilter;
