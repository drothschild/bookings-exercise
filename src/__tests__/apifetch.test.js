import mockAxios from 'axios';
import {
    fetchCompany,
    fetchLocations,
    fetchDeals,
    fetchEmployees,
    fetchPricings
} from '../apiFetch';
import company from './dummy-data/companyDummy.json';
import locations from './dummy-data/locationsDummy.json';
import deals from './dummy-data/dealsDummy.json';
import employees from './dummy-data/employeesDummy';
import pricings from './dummy-data/pricingsDummy';

it('fetches company Data from mytime', async () => {
    mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
            data: { company }
        })
    );
    const receivedCompany = await fetchCompany(1);
    expect(receivedCompany).toEqual(company);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.mytime.com/api/mkp/v1/companies/1'
    );
    jest.clearAllMocks();
});

it('fetches location Data from mytime', async () => {
    mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
            data: { locations }
        })
    );
    const receivedLocations = await fetchLocations(1);
    expect(receivedLocations).toEqual(locations);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.mytime.com/api/mkp/v1/companies/1/locations'
    );
    jest.clearAllMocks();
});
it('fetches deals from mytime', async () => {
    mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
            data: { deals }
        })
    );
    const receivedDeals = await fetchDeals(1, 1);
    expect(receivedDeals).toEqual(deals);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.mytime.com/api/mkp/v1/companies/1/deals',
        {
            params: {
                location_ids: 1
            }
        }
    );
    jest.clearAllMocks();
});
it('fetches employees from mytime', async () => {
    // setup
    mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
            data: { employees }
        })
    );
    const receivedEmployees = await fetchEmployees(1, 1);
    expect(receivedEmployees).toEqual(employees);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.mytime.com/api/mkp/v1/companies/1/employees',
        {
            params: {
                location_ids: 1
            }
        }
    );
    jest.clearAllMocks();
});
it('fetches pricing from mytime', async () => {
    // setup
    mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
            data: { pricings }
        })
    );
    const receivedPricings = await fetchPricings(1, 1);
    expect(receivedPricings).toEqual(pricings);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.mytime.com/api/mkp/v1/companies/1/pricings',
        {
            params: {
                location_ids: 1
            }
        }
    );
    jest.clearAllMocks();
});
