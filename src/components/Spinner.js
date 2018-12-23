import React, { Component } from 'react';
import styled from 'styled-components';

// Loading SVG from https://codepen.io/aurer/pen/jEGbA

const SpinningSVG = styled.svg`
    path,
    rect {
        fill: ${props => props.theme.blue};
    }
    animation-name: spin;
    animation-duration: 500ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;

export default class Spinner extends Component {
    render() {
        return (
            <SpinningSVG
                version="1.1"
                id="loader-3"
                x="0px"
                y="0px"
                width="40px"
                height="40px"
                viewBox="0 0 50 50"
                space="preserve"
            >
                <path
                    fill="#000"
                    d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
                />
            </SpinningSVG>
        );
    }
}
