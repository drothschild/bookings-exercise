import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import ErrorMessage from './components/ErrorMessage';
import { fetchCompany, fetchLocations } from './apiFetch';
import Header from './components/Header';
import { COMPANY_ID } from './defaults';
import Spinner from './components/Spinner';

const theme = {
    black: '#333',
    blue: '#2068a3',
    lightGray: '#f7f7f7',
    maxWidth: '1300px',
    bs: '0 1px 1px 0 #ccc;'
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
    line-height: 2;
  }
  a {
    color: ${theme.blue};
  }`;

const StyledPage = styled.div`
    background: white;
    color: ${props => props.theme.black};
`;

const Inner = styled.div`
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
    padding: 2rem;
`;

class App extends Component {
    state = {
        company: null,
        locations: [],
        loadingData: false,
        error: null
    };
    loadData = async () => {
        this.setState({ loadingData: true, error: null });
        try {
            const company = await fetchCompany(COMPANY_ID);
            const locations = await fetchLocations(COMPANY_ID);
            this.setState({
                company,
                locations,
                loadingData: false
            });
        } catch (error) {
            this.setState({ error, loadingData: false });
        }
    };
    componentDidMount() {
        this.loadData();
    }
    render() {
        const { loadingData, company, error, locations } = this.state;

        return (
            <ThemeProvider theme={theme}>
                <div>
                    <GlobalStyle />
                    {error && <ErrorMessage error={error} />}
                    {loadingData && <Spinner />}
                    {company && <Header company={company} />}

                    <Inner>
                        <StyledPage />
                    </Inner>
                </div>
            </ThemeProvider>
        );
    }
}

export default App;
