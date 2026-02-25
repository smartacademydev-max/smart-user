import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const countryApi = createApi({
    reducerPath: 'countryApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://restcountries.com/v3.1/' }),
    endpoints: (builder) => ({
        getAllCountries: builder.query<any[], void>({
            query: () => 'all?fields=name,flags',
        }),
    }),
});

export const { useGetAllCountriesQuery } = countryApi;