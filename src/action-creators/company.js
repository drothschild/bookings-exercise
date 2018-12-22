import { ADD_COMPANY } from '../actions';
import { fetchCompany } from '../apiFetch';

export function addCompany(company) {
    return {
        type: ADD_COMPANY,
        payload: company
    };
}

export function getCompany(id) {
    return dispatch => {
        fetchCompany(id).then(company => {
            dispatch(company);
        });
    };
}
