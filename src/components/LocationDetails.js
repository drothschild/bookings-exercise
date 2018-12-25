import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { fetchEmployees, fetchDeals, fetchPricings } from '../apiFetch';


export default class LocationDetails extends Component {
    state = {
        employees: [],
        deals: [],
        pricings: [],
        serviceFilter: 'all',
        employeeFilter: 'all',
        location: this.props.locations.find(loc => {
            return parseInt(loc.id) === parseInt(this.props.locId);
        })
    };

    loadData = async () => {
        const { setLoading, companyId } = this.props;
        const { location } = this.state;
        setLoading({ loadingData: true, error: null });
        try {
            const employees = await fetchEmployees(companyId, location.id);
            const deals = await fetchDeals(companyId, location.id);
            const pricings = await fetchPricings(companyId, location.id);
            console.log(deals);
            setLoading({
                loadingData: false
            });
            this.setState({
                employees,
                deals,
                pricings
            });
        } catch (error) {
            setLoading({ error, loadingData: false });
        }
    };
    componentDidMount() {
        console.log(
            this.props.locations.find(loc => {
                return loc.id === this.props.locId;
            })
        );
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
        const servicesMenu = deals.filter(deal => {
            return (
                employeeFilter === 'all' ||
                deal.variations.filter(variation => {
                    return (
                        pricings.filter(pricing => {
                            return (
                                pricing.variation_id === variation.id &&
                                pricing.employee_id === parseInt(employeeFilter)
                            );
                        }).length > 0
                    );
                }).length > 0
            );
        });
        const variationsMenu = servicesMenu.filter(deal => {
            return  serviceFilter === 'all' || deal.id === parseInt(serviceFilter);
        });
        return (
            <div>
                <div>
                    <button
                        key="all"
                        id={'all'}
                        chosen={'all' === serviceFilter ? '' : undefined}
                        onClick={e => {
                            this.setState({ serviceFilter: e.target.id });
                        }}
                    >
                        All Services
                    </button>
                    {servicesMenu.map(deal => {
                        const { id, service, variations } = deal;
                        return (
                            <button
                                key={id}
                                id={id}
                                chosen={id === serviceFilter ? true : undefined}
                                onClick={e => {
                                    this.setState({
                                        serviceFilter: e.target.id
                                    });
                                }}
                            >
                                {service.name} - {variations.length}
                            </button>
                        );
                    })}
                </div>
                <div>
                    <button
                        id="all"
                        onClick={e => {
                            this.setState({
                                employeeFilter: e.target.id
                            });
                        }}
                    >
                        All Employees
                    </button>
                    {employees.map(employee => {
                        const { id, name } = employee;
                        return (
                            <button
                                key={id}
                                id={id}
                                onClick={e => {
                                    this.setState({
                                        employeeFilter: e.target.id
                                    });
                                }}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }
}
