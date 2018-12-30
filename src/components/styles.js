import styled from 'styled-components';

export const Main = styled.div`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    padding: 14px 48px 48px;
    background-color: #f7f7f7;
`;

export const BlueButton = styled.button`
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

export const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2.5em;
    padding: 0;
    text-align: left;
    min-width: 386px;
    max-width: 480px;
    flex-shrink: 0;
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

export const Section = styled.div`
    position: relative;
    margin: 0px;
`;
