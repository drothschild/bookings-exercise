import styled from 'styled-components';
//TODO: Move into Styles.js
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
            color: rgb(32, 104, 163);
        }
        .details {
            color: rgba(51, 51, 51, 0.5);
        }
    }
`;
