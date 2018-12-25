import axios from 'axios';
import { API_URL } from './defaults';
var fs = require('fs');

export async function fetchCompany(id) {
    const url = `${API_URL}companies/${id}`;
    const res = await axios.get(url);
    return res.data.company;
}

export async function fetchLocations(id) {
    const url = `${API_URL}companies/${id}/locations`;
    const res = await axios.get(url);
    return res.data.locations;
}

export async function fetchDeals(companyId, locationId) {
    const url = `${API_URL}companies/${companyId}/deals`;
    const res = await axios.get(url, {
        params: {
            location_ids: locationId
        }
    });
    return res.data.deals;
}

export async function fetchEmployees(companyId, locationId) {
    const url = `${API_URL}companies/${companyId}/employees`;
    const res = await axios.get(url, {
        params: {
            location_ids: locationId
        }
    });
    return res.data.employees;
}

export async function fetchPricings(companyId, locationId) {
    const url = `${API_URL}companies/${companyId}/pricings`;
    const res = await axios.get(url, {
        params: {
            location_ids: locationId
        }
    });
    return res.data.pricings;
}
