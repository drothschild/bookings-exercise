import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const HeaderDiv = styled.div`
    display: block;
    position: relative;
    height: 80px;
    top: 0;
    width: 100%;
`;

const HeaderContainer = styled.div`
    padding: 0 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${props => props.theme.darkGrey};
    position: relative;
`;

const HeaderCompany = styled.div`
    height: 68px;
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
`;

const CompanyDetails = styled.div`
    align-self: flex-start;
    height: 1px;
    flex: 1 1 auto;
    display: flex;
    img {
        max-width: 240px;
        width: auto;
        height: 100%;
        flex: 0 0 auto;
        vertical-align: middle;
        object-fit: contain;
    }
    h1 {
        font-size: 18px;
        font-weight: 400;
        display: inline-block;
        padding-left: 12px;
        align-self: center;
        white-space: nowrap;
    }
`;

const Header = ({ company }) => {
    const { marketing_logo: logo = null } = company;
    return (
        <HeaderDiv>
            <HeaderContainer>
                <HeaderCompany>
                    <CompanyDetails>
                        <img src={logo.original} alt={`${company.name} logo`} />
                        <h1>{company.name}</h1>
                    </CompanyDetails>
                </HeaderCompany>
            </HeaderContainer>
        </HeaderDiv>
    );
};

Header.propTypes = {
    company: PropTypes.object
};

export default Header;
