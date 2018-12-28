import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { fetchEmployees, fetchDeals, fetchPricings } from '../../apiFetch';
import SidebarFilter from './EmployeeFilter';
import ServicesFilter from './ServicesFilter';
import EmployeeFilter from './EmployeeFilter';

const Content = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    min-height: 100%;
    position: relative;
    padding: 0;
    margin: 0;
    border: 0;
`;
const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2.5em;
    padding: 0;
    text-align: left;
    min-width: 386px;
    flex: 0 1 0%;
    div {
        margin: 0;
        padding: 0;

        border: 0;

        font-size: 100%;

        font: inherit;

        vertical-align: baseline;
    }
`;

const Section = styled.div`
    max-width: 480px;
    position: relative;
    margin: 0px;
    :not(:last-child)::after {
        content: '';
        position: absolute;
        bottom: -12px;
        height: 1px;
        display: block;
        background: rgba(0, 0, 0, 0.1);
        margin: 12px 48px 0;
        width: calc(100% - 2 * 48px);
    }
`;

const Title = styled.h4`
    color: #333;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.92px;
    text-transform: uppercase;
`;

const Main = styled.div`
    display: flex;
    flex-direction: column;
    padding: 14px 48px 48px;
    flex: 1 1 auto;
    background-color: #f7f7f7;
`;

const ServiceCategory = styled.div`
    max-width: 480px;
    margin: 0;
`;

const Variations = styled.div`
    background: #fff;
    padding: 12px;
    box-shadow: 0 0 4px 0 #ccc;
`;
const VariationItem = styled.div`
    height: 100%;
    width: 100%;
    flex-direction: row;
    display: flex;
    align-content: space-between;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    padding-top: 12px;
    overflow: hidden;
    :first-child {
        padding-top: 0;
    }
    :not(:last-child) {
        border-bottom: 1px solid #ccc;
    }
    .left-col {
        flex: 1 1 100%;
        box-sizing: border-box;
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

const VariationTitle = styled.h5`
    font-size: 16px;
    line-height: 24px;
    max-width: 400px;
    margin: 0;
    padding: 0;
    border: 0;
`;

const VariationDetails = styled.div`
    flex-direction: column;
    display: flex;
    color: rgba(51, 51, 51, 0.5);
    font-size: 14px;
`;

const BookButton = styled.button`
    background-color: rgb(32, 104, 163);
    color: rgb(255, 255, 255);
    border: none;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    line-height: normal;
    outline: none;
    padding: 12px 24px;
    font-size: 14px;
    transition: all 0.18s ease-in-out;
    ${props => (props.disabled ? `cursor : default;` : '')}
`;

const Location = styled.div`
    p {
        color: black;
        font-size: 14px;
        letter-spacing: 0.21px;
    }
`;

export default class LocationDetails extends Component {
    state = {
        employees: [],
        deals: [],
        pricings: [],
        serviceFilter: -1,
        employeeFilter: -1,
        location: this.props.locations.find(loc => {
            return parseInt(loc.id) === parseInt(this.props.locId);
        })
    };
    setServiceFilter = serviceFilter => {
        this.setState({ serviceFilter });
    };
    setEmployeeFilter = employeeFilter => {
        this.setState({ employeeFilter });
    };
    loadData = async () => {
        const { setLoading, companyId, locId } = this.props;
        setLoading({ loadingData: true, error: null });
        try {
            const [employees, deals, pricings] = await Promise.all([
                fetchEmployees(companyId, locId),
                fetchDeals(companyId, locId),
                fetchPricings(companyId, locId)
            ]);
            setLoading({
                loadingData: false,
                error: null
            });
            this.setState({
                employees,
                deals,
                pricings
            });
        } catch (error) {
            console.log(error);
            setLoading({ error, loadingData: false });
        }
    };
    componentDidMount() {
        this.loadData();
    }

    render() {
        const {
            employees,
            deals,
            pricings,
            serviceFilter,
            employeeFilter
        } = this.state;

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
            if (!pricing.promoting) {
                return `$${pricing.new_list_price.toFixed(2)}`;
            } else {
                return `$${pricing.new_min_price.toFixed(
                    2
                )} - $${pricing.new_list_price.toFixed(2)}`;
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

        const servicesMenu = deals.filter(deal => {
            return (
                parseInt(serviceFilter) === -1 ||
                deal.id === parseInt(serviceFilter)
            );
        });

        return (
            <Content>
                <Sidebar>
                    <div>
                        <Section>
                            <ServicesFilter
                                employees={employees}
                                deals={deals}
                                pricings={pricings}
                                serviceFilter={serviceFilter}
                                employeeFilter={employeeFilter}
                                setServiceFilter={this.setServiceFilter}
                            />
                        </Section>
                        <Section>
                            <EmployeeFilter
                                employees={employees}
                                deals={deals}
                                pricings={pricings}
                                serviceFilter={serviceFilter}
                                employeeFilter={employeeFilter}
                                setEmployeeFilter={this.setEmployeeFilter}
                            />
                        </Section>
                    </div>
                </Sidebar>
                <Main>
                    {servicesMenu.map(service => {
                        return (
                            <ServiceCategory key={service.id}>
                                <Title>{service.service.name}</Title>
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
                                                    <VariationTitle>
                                                        {variation.name}
                                                    </VariationTitle>
                                                    <VariationDetails>
                                                        {variation.duration}{' '}
                                                        minutes |{' '}
                                                        {filteredPricing(
                                                            variation
                                                        )}
                                                    </VariationDetails>
                                                </div>
                                                <div className="right-col" />
                                                <BookButton
                                                    disabled={isDisabledVariation(
                                                        variation
                                                    )}
                                                >
                                                    Book
                                                </BookButton>
                                            </VariationItem>
                                        );
                                    })}
                                </Variations>
                            </ServiceCategory>
                        );
                    })}
                </Main>
            </Content>
        );
    }
}
