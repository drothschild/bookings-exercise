import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Router } from '@reach/router';
import ErrorMessage from './components/ErrorMessage';
import { fetchCompany, fetchLocations, fetchEmployees, fetchDeals, fetchPricings } from './apiFetch';
import Header from './components/Header';
import { COMPANY_ID } from './defaults';
import Spinner from './components/Spinner';
import LocationsList from './components/LocationsList';
import LocationDetails from './components/LocationDetails';
import Schedule from './components/Schedule';

const theme = {
    black: '#333',
    blue: '#2068a3',
    lightGray: '#f7f7f7',
    darkGray: '#4f4f4f',
    maxWidth: '1300px',
    bs: '0 1px 1px 0 #ccc'
};

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2em;
  }
  a {
    color: ${theme.blue};
  }`;

const StyledPage = styled.div`
    background: white;
    color: ${props => props.theme.black};
`;

const Content = styled.div`
    .content {
        display: flex;
        position: relative;
        padding: 0;
        margin: 0;
        border: 0;
    }
`;
const path = window.location.pathname;
const locationId = path.length > 1 ? path.match(/\/(\d+)/)[1] : -1;

class App extends Component {
    state = {
        company: null,
        companyId: COMPANY_ID,
        deals: [],
        locations: [],
        employees: [],
        pricings: [],
        loadingData: false,
        loadingLocationData: false,
        error: null
    };
    setLoading = ({ loadingData, error = null }) => {
        this.setState({ loadingData, error });
    };

    loadData = async () => {
        const { companyId } = this.state;
        this.setState({ loadingData: true, error: null });
        try {
            const [company, locations] = await Promise.all([
                fetchCompany(companyId),
                fetchLocations(companyId)
            ]);
            this.setState({
                company,
                locations,
                loadingData: false,
                error: null
            });
        } catch (error) {
            this.setState({ error, loadingData: false });
        }
    };

    loadLocationData = async () => {
        const { companyId } = this.state;
        if (locationId === -1) {
            this.setState({ employees: [], deals: [], pricings: []});
            return;
        }
    this.setState({loadingLocationData: true, error: null})
        try {
            const [employees, deals, pricings] = await Promise.all([fetchEmployees(companyId, locationId), fetchDeals(companyId, locationId), fetchPricings(companyId, locationId )]);
            this.setState({
                employees,
                deals,
                pricings,
                error: null,
                loadingLocationData: false
            });
        } catch (error) {
            this.setState({ employees: [], deals: [], pricings: [], error,loadingLocationData: false });
        }
    };
    componentDidMount() {
        this.loadData();
    }
    render() {
        const {
            loadingData,
            company,
            error,
            locations,
            employees,
            pricings,
            deals,
loadingLocationData

        } = this.state;
        const location = locations.find(loc => {
            return loc.id === parseInt(locationId);
        });
        return (
            <ThemeProvider theme={theme}>
                <div>
                    <GlobalStyle />
                    <StyledPage>
                        {company && <Header company={company} />}

                        <Content>
                            {error && <ErrorMessage error={error} />}
                            {loadingData && <Spinner />}
                            {locations.length > 0 && (
                                <Router className="content">
                                    <LocationsList
                                        path="/"
                                        locations={locations}
                                    />
                                    <LocationDetails
                                        path="/:locationId"

                                        loc={location}
                                        deals={deals}
                                        pricings={pricings}
                                        employees={employees}
                                        loadLocationData={this.loadLocationData}
                                        loadingData={loadingLocationData}
                                        companyId={COMPANY_ID}
                                    />
                                    <Schedule
                                        path="/:locationId/schedule/:search"
                                        loc={location}
                                        deals={deals}
                                        employees={employees}
                                        pricings={pricings}             loadLocationData={this.loadLocationData}

                                    />
                                </Router>
                            )}
                        </Content>
                    </StyledPage>
                </div>
            </ThemeProvider>
        );
    }
}

export default App;
