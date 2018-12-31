import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import queryString from 'query-string';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import { fetchOpenTimes } from '../apiFetch';
import {
    Main,
    BlueButton,
    Sidebar,
    Section,
    SectionTitle,
    ItemTitle,
    MainTitle
} from './styles';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import EmployeeFilter from './EmployeeFilter';

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

    .left-col {
        flex: 1 1 100%;
        flex-direction: column;
        display: flex;
        align-content: flex-start;
        justify-content: space-around;
        align-items: flex-start;
    }
    .right-col {
        align-self: center;

    }
    ::after {
        content: '';
        z-index: 0;
        height: 80px;
        width: 100%;
        position: absolute;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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

class Schedule extends Component {
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
    handleClick = () => {
        alert('Sorry, reservations have not yet been implemented.');
    };

    loadData = async () => {
        const { locationId } = this.props;
        const {
            employee: employeeId,
            variation: variationId
        } = queryString.parse(window.location.search);
        const { date } = this.state;
        const params = {
            locationId,
            variationId,
            date: moment(date).format('YYYY-MM-DD')
        };
        if (employeeId > 0) {
            params.employeeId = employeeId;
        }
        this.setState({ times: [], loadingData: true, error: null });
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
        window.history.pushState(
            '',
            '',
            `${origin}${pathname}${replacedSearch}`
        );
        this.loadData();
    };

    componentDidMount() {
        const { loadLocationData, employees } = this.props;
        this.loadData();
        if (employees.length === 0) {
            loadLocationData();
        }
    }
    render() {
        const { times, date, error, loadingData } = this.state;
        const { employees, deals, pricings } = this.props;
        const {
            employee: employeeFilter,
            variation: variationId
        } = queryString.parse(window.location.search);
        const uniqueTimes = filterUnique(times);
        const isDisabledEmployee = employee => {
            const id = employee.id;
            const deal = deals.find(deal =>
                deal.variations.find(
                    variation => parseInt(variationId) === variation.id
                )
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
        const employee = time => {
            const { employee_id: employeeId } = time;
            return employees.find(employee => employee.id === employeeId);
        };
        return (
            <>
                <Sidebar>
                    <Section>
                        <SectionTitle>Appointment Date</SectionTitle>
                        <Calendar
                            calendarType="US"
                            onChange={this.handleDateChange}
                            value={date}
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
                    {error && <ErrorMessage error={error} />}
                    {loadingData && <Spinner />}
                    {uniqueTimes.length === 0 && !loadingData && (
                        <MainTitle>No available times on this date</MainTitle>
                    )}
                    {uniqueTimes.length > 0 && employees.length > 0 && (
                        <>
                            <MainTitle>Pick a Time</MainTitle>
                            <OpenTimeList>
                                {uniqueTimes.map(time => (
                                    <OpenTimeItem key={time.begin_at}>
                                        <div className="left-col">
                                            <ItemTitle>
                                                {moment(time.begin_at).format(
                                                    'LT'
                                                )}{' '}
                                                | {employee(time).name}
                                            </ItemTitle>
                                            <div>{formatPrice(time)}</div>
                                        </div>
                                        <div className="right-col" />
                                        <BlueButton onClick={this.handleClick}>
                                            Reserve
                                        </BlueButton>
                                    </OpenTimeItem>
                                ))}
                            </OpenTimeList>
                        </>
                    )}
                </Main>
            </>
        );
    }
}

Schedule.propTypes = {
    employees: PropTypes.array,
    deals: PropTypes.array,
    pricings: PropTypes.array
};
export default Schedule;
