import axios from 'axios';
import { API_URL } from './defaults';

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

export async function fetchOpenTimes({
    locationId,
    variationId,
    employeeId,
    date
}) {
    const url = `${API_URL}open_times`;
    const params = {
        location_id: locationId,
        is_existing_customer: false,
        variation_ids: variationId,
        date: date,
        child_id: 1,
        custom_field_id: 1,
        custom_field_values: 1,
        employee_id: employeeId
    };
    try {
        const res = await axios.get(url, { params });
        return res.data.open_times;
    } catch (error) {
        if (error.response.status === 422) {
            return [];
        }
        throw error;
    }
}
