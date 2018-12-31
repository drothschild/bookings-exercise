import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from '@reach/router';
import ServicesFilter from './ServicesFilter';
import EmployeeFilter from './EmployeeFilter';
import Spinner from './Spinner';
import {
    Main,
    BlueButton,
    Sidebar,
    Section,
    ItemTitle,
    SectionTitle
} from './styles';

const ServiceCategory = styled.div`
    margin: 0;
`;

const Variations = styled.div`
    background: #fff;
    padding: 12px;
    box-shadow: 0 0 4px 0 #ccc;
`;

const VariationItem = styled.div`
    flex-direction: row;
    display: flex;
    align-content: space-between;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    overflow: hidden;
    :first-child {
        padding-top: 0;
    }
    :not(:last-child) {
        border-bottom: 1px solid #ccc;
    }
    .left-col {
        flex: 1 1 100%;
        flex-direction: column;
        display: flex;
        align-content: flex-start;
        justify-content: space-around;
        align-items: flex-start;
    }
    .right-col {
        align-self: baseline;
    }
    ${props => (props.disabled ? `opacity: .3;` : '')}
`;

const VariationDetails = styled.div`
    flex-direction: column;
    display: flex;
    color: rgba(51, 51, 51, 0.5);
    font-size: 14px;
`;

const Address = styled.div`
    p {
        color: black;
        font-size: 14px;
        letter-spacing: 0.21px;
        margin: 0;
    }
`;

class LocationDetails extends Component {
    state = {
        serviceFilter: -1,
        employeeFilter: -1
    };
    setServiceFilter = serviceFilter => {
        this.setState({ serviceFilter });
    };
    setEmployeeFilter = employeeFilter => {
        this.setState({ employeeFilter });
    };
    componentDidMount() {
        this.props.loadLocationData();
    }
    render() {
        const { serviceFilter, employeeFilter } = this.state;
        const {
            employees,
            deals,
            pricings,
            loadingData,
            locations,
            locationId
        } = this.props;
        const location = locations.find(loc => {
            return loc.id === parseInt(locationId);
        });
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
        const services = deals.filter(deal => !deal.is_addon);
        const filteredPricing = variation => {
            const pricing = pricings.find(pricing => {
                return (
                    (parseInt(employeeFilter) === -1 ||
                        parseInt(employeeFilter) === pricing.employee_id) &&
                    variation.id === pricing.variation_id
                );
            });
            if (!pricing) {
                return 'Not Offered';
            }
            if (
                pricing.new_min_price &&
                pricing.new_list_price !== pricing.new_min_price
            ) {
                return `$${pricing.new_min_price.toFixed(
                    2
                )} - $${pricing.new_list_price.toFixed(2)}`;
            } else {
                return `$${pricing.new_list_price.toFixed(2)}`;
            }
        };

        const isDisabledVariation = variation => {
            return (
                parseInt(employeeFilter) !== -1 &&
                pricings.filter(pricing => {
                    return (
                        pricing.variation_id === variation.id &&
                        pricing.employee_id === parseInt(employeeFilter)
                    );
                }).length === 0
            );
        };

        const servicesMenu = services.filter(deal => {
            return (
                parseInt(serviceFilter) === -1 ||
                deal.id === parseInt(serviceFilter)
            );
        });
        if (loadingData) {
            return <Spinner />;
        }
        return (
            <>
                <Sidebar>
                    <Section>
                        <Address>
                            <SectionTitle>Address</SectionTitle>
                            <p>{location.street_address}</p>
                            <p>{`${location.city}, ${location.state} ${
                                location.zip_code
                            }`}</p>
                        </Address>
                    </Section>
                    <Section>
                        <ServicesFilter
                            employees={employees}
                            services={services}
                            pricings={pricings}
                            serviceFilter={parseInt(serviceFilter)}
                            employeeFilter={parseInt(employeeFilter)}
                            setServiceFilter={this.setServiceFilter}
                        />
                    </Section>
                    <Section>
                        <EmployeeFilter
                            employees={employees}
                            employeeFilter={parseInt(employeeFilter)}
                            isDisabledEmployee={isDisabledEmployee}
                            setEmployeeFilter={this.setEmployeeFilter}
                        />
                    </Section>
                </Sidebar>
                <Main>
                    {servicesMenu.map(service => {
                        return (
                            <ServiceCategory key={service.id}>
                                <SectionTitle>
                                    {service.service.name}
                                </SectionTitle>
                                <Variations>
                                    {service.variations.map(variation => {
                                        return (
                                            <VariationItem
                                                key={variation.id}
                                                disabled={isDisabledVariation(
                                                    variation
                                                )}
                                            >
                                                <div className="left-col">
                                                    <ItemTitle>
                                                        {variation.name}
                                                    </ItemTitle>
                                                    <VariationDetails>
                                                        {variation.duration}{' '}
                                                        minutes |{' '}
                                                        {filteredPricing(
                                                            variation
                                                        )}
                                                    </VariationDetails>
                                                </div>
                                                <div className="right-col" />
                                                <Link
                                                    to={`/${
                                                        this.props.locationId
                                                    }/schedule/search?employee=${employeeFilter}&variation=${
                                                        variation.id
                                                    }`}
                                                >
                                                    <BlueButton
                                                        disabled={isDisabledVariation(
                                                            variation
                                                        )}
                                                    >
                                                        Book
                                                    </BlueButton>
                                                </Link>
                                            </VariationItem>
                                        );
                                    })}
                                </Variations>
                            </ServiceCategory>
                        );
                    })}
                </Main>
            </>
        );
    }
}

LocationDetails.propTypes = {
    employees: PropTypes.array,
    deals: PropTypes.array,
    pricings: PropTypes.array,
    loadingData: PropTypes.bool,
    locations: PropTypes.array,
    locationId: PropTypes.string,
    loadLocationData: PropTypes.func.isRequired
};
export default LocationDetails;
