import React, { Component } from 'react';
import moment from 'moment';
import queryString from 'query-string';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import { fetchOpenTimes } from '../apiFetch';
import { Main, BlueButton, Sidebar, Section } from './styles';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import EmployeeFilter from './EmployeeFilter'

const OpenTimeList = styled.div`
    margin-top: 20px;
    box-shadow: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
    padding: 12px;
`;

const OpenTimeItem = styled.div`
    position: relative;
    margin: 0;
    min-width: 100%;
    flex-direction: row;
    box-sizing: border-box;
    display: flex;
    max-height: 100%;
    align-content: space-between;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    :after {
        content: '';
        z-index: 0;
        height: 80px;
        width: 100%;
        position: absolute;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
        align-self: center;
    }
`;
const filterUnique = times => {
    const result = [];
    times.forEach(time => {
        if (result.indexOf(time.begin_at) < 0) {
            result.push(time);
        }
    });
    return result;
};

const formatPrice = time => {
    if (time.list_price === time.min_price) {
        return `$${time.list_price.toFixed(2)}`;
    } else {
        return `$${time.min_price.toFixed(2)} - $${time.list_price.toFixed(2)}`;
    }
};

export default class Schedule extends Component {
    state = {
        date: new Date(),
        times: [],
        loading: false,
        error: null
    };
    handleDateChange = date => {
        if (!date) {
            return;
        }
        this.setState({ date }, this.loadData);
    };

    loadData = async () => {
        const { locationId } = this.props;
        const { employee: employeeId, variation: variationId } = queryString.parse(window.location.search);
        const { date } = this.state;
        const params = {
            locationId,
            variationId,
            date: moment(date).format('YYYY-MM-DD')
        };
        if (employeeId > 0) {
            params.employeeId = employeeId;
        }
        this.setState({ loadingData: true, error: null });
        try {
            const times = await fetchOpenTimes(params);
            this.setState({ times, loadingData: false, error: null });
        } catch (error) {
            this.setState({ error, loadingData: false });
        }
    };
    setEmployeeFilter = employeeId => {
        const { origin, pathname, search } = window.location;
        const { employee } = queryString.parse(search);
        if (!employee || employee === employeeId) {
            return;
        }
        const replacedSearch = search.replace(
            `employee=${employee}`,
            `employee=${employeeId}`
        );
        window.history.pushState('', '' , `${origin}${pathname}${replacedSearch}`)
        this.loadData();
    };


    componentDidMount() {
        const {loadLocationData, employees} = this.props
        this.loadData();
        if (employees.length === 0) {
            loadLocationData();
        }
    }
    render() {
        const { times, date, error, loadingData } = this.state;
        const { employees, deals, pricings }= this.props;
        const uniqueTimes = filterUnique(times);
        const { employee: employeeFilter, variation: variationId } = queryString.parse(window.location.search);
        const isDisabledEmployee = employee => {
            const id = employee.id;
            const deal = deals.find(
     (deal => deal.variations.find(variation =>  parseInt(variationId)===variation.id
                ))
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
        }
        return (
            <>
                <Sidebar>
                    <Section>
                        <Calendar
                            onChange={this.handleDateChange}
                            value={date}
                        />
                    </Section>
                    <Section><EmployeeFilter employees={employees}employeeFilter={employeeFilter} isDisabledEmployee={isDisabledEmployee} setEmployeeFilter={this.setEmployeeFilter}/></Section>
                </Sidebar>
                <Main>
                    {error && <ErrorMessage error={error} />}
                    {loadingData && <Spinner />}
                    {uniqueTimes.length ===0 && <div>No available times on this date</div>}
                    {uniqueTimes.length > 0 && (
                        <OpenTimeList>
                            {uniqueTimes.map(time => (
                                <OpenTimeItem key={time.begin_at}>
                                    <div className="left-col">
                                        <h5>
                                            {moment(time.begin_at).format('LT')}
                                        </h5>
                                        <div>{formatPrice(time)}</div>
                                    </div>
                                    <div className="right-col">
                                        <BlueButton>Reserve</BlueButton>
                                    </div>
                                </OpenTimeItem>
                            ))}
                        </OpenTimeList>
                    )}
                </Main>
            </>
        );
    }
}
