import styled from 'styled-components';

export const Main = styled.div`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    padding: 14px 48px 48px;
    background-color: #f7f7f7;
`;

export const BlueButton = styled.button`
    background-color: ${props => props.theme.blue};
    color: rgb(255, 255, 255);
    border: none;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    line-height: normal;
    outline: none;
    z-index: 100;
    font-size: 1em;
    padding: 12px 24px;
    transition: all 0.18s ease-in-out;
    ${props => (props.disabled ? `cursor : default;` : '')}
`;

export const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2.5em;
    padding: 0;
    text-align: left;
    min-width: 386px;
    max-width: 480px;
    flex-shrink: 0;
`;

export const Section = styled.div`
    position: relative;
    margin: 0px;
    padding: 0px 0px 0px 48px;
    :not(:last-child):after {
        content: '';
        position: absolute;
        bottom: -12px;
        height: 1px;
        display: block;
        background: rgba(0, 0, 0, 0.1);
        margin: 48px 0px 0px 0px;
        width: calc(100% - 48px);
    }
`;

export const MainTitle = styled.h2`
    font-size: 2em;
`;

export const SectionTitle = styled.h4`
    color: ${props => props.theme.black};
    font-weight: 700;
    text-transform: uppercase;
`;

export const ItemTitle = styled.h5`
    text-transform: capitalize;
    line-height: 2.5em;
    max-width: 400px;
    margin: 0;
    padding: 0;
    border: 0;
`;

export const SelectMenu = styled.fieldset`
    border-width: 0;
    padding: 0;
    input {
        display: none;
        :checked + label,
        :hover + label {
            background-color: rgba(0, 0, 0, 0.1);
        }
        :disabled + label {
            cursor: default;
            opacity: 0.3;
            :hover {
                background-color: inherit;
            }
        }
    }
    label {
        border-width: 0;
        padding: 0;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        text-transform: capitalize;
        width: 100%;

        .option {
            color: ${props => props.theme.blue};
        }
        .details {
            color: ${props => props.theme.darkGray};
        }
    }
`;
