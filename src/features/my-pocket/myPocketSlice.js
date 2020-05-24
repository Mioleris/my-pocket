import { createSlice, createAsyncThunk, compose } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_CURRENCY = 'EUR';

export const fetchExchangerates = createAsyncThunk(
    'myPocket/fetchExchangerates',
    async () => {
        const response = await axios.get('https://api.exchangeratesapi.io/latest?base=EUR');
        return await response.data;
    }
  )

export const myPocketSlice = createSlice({
    name: 'myPocket',
    initialState: {
        pockets: [
            // Setting default pockets
            {
                currency: 'GBP',
                amount: 0,
                symbol: '£',
            },
            {
                currency: BASE_CURRENCY,
                amount: 1000,
                symbol: '€',
            },
            {
                currency: 'USD',
                amount: 2500,
                symbol: '$',
            },
        ],
        exchangePocketFrom: BASE_CURRENCY,
        exchangePocketTo: 'GBP',
        exchangePocketValueFrom: '',
        exchangePocketValueTo: '',
        currentRates: null,
        ratesIsLoading: false,
        exchangeRate: '',
        exchangeAllowed: false
    },
    reducers: {
        setExchangePocketFrom: (state, action) => {
            state.exchangePocketFrom = action.payload;
        },
        setExchangePocketTo: (state, action) => {
            state.exchangePocketTo = action.payload;
        },
        // TODO: Refactor setExchangePocketValueFrom && setExchangePocketValueTo
        // Because they look similar and share same logick
        setExchangePocketValueFrom: (state, action) => {
            state.exchangeAllowed = true;

            let value = 1;

            if (action.payload && !isNaN(action.payload)) {
                if (Number(action.payload) !== 0) {
                    value = Number(action.payload);
                }
                state.exchangePocketValueFrom = Number(action.payload);
            } else {
                state.exchangePocketValueFrom = '';
            }

            // Exchange cases
            // First exchange case when pockest matches
            if (state.exchangePocketFrom === state.exchangePocketTo) {
                state.exchangeAllowed = false;
                state.exchangePocketValueTo = value;
                state.exchangeRate = Number(1).toFixed(4);
            // Second exchange case when changing from base currency, to some other currency,
            //  base currency is not included in API
            } else if (state.exchangePocketFrom === BASE_CURRENCY) {
                if (state.currentRates.rates.hasOwnProperty(state.exchangePocketTo)) {
                    state.exchangeRate = Number(state.currentRates.rates[state.exchangePocketTo]).toFixed(4);
                    state.exchangePocketValueTo = value * state.exchangeRate;
                }
            // Third exchange is when changing from any currency to base currency or other any currency
            } else if (state.currentRates.rates.hasOwnProperty(state.exchangePocketFrom)) {
                if (state.exchangePocketTo === BASE_CURRENCY) {
                    state.exchangePocketValueTo = value / Number(state.currentRates.rates[state.exchangePocketFrom]);
                    state.exchangeRate = (state.exchangePocketValueTo / value).toFixed(4);
                } else if (state.currentRates.rates.hasOwnProperty(state.exchangePocketTo)) {
                    state.exchangePocketValueTo = (value / state.currentRates.rates[state.exchangePocketFrom]) * state.currentRates.rates[state.exchangePocketTo];
                    state.exchangeRate = (state.exchangePocketValueTo / value).toFixed(4);
                }
            }

            // Just simple styling things when to leave empty input or when insert 0
            if (state.exchangePocketValueFrom === '') {
                state.exchangePocketValueTo = '';
            } else if (state.exchangePocketValueFrom === 0) {
                state.exchangePocketValueTo = 0;
            }

            // Check if exchange is allowed, disable or enable button
            let pocketFrom = state.pockets.find(p => p.currency === state.exchangePocketFrom);

            if (Number(pocketFrom.amount) < state.exchangePocketValueFrom  || Number(state.exchangePocketValueFrom) === 0) {
                state.exchangeAllowed = false;
            }

            // Check if value has two decimals
            let checkForTwoDecimals = action.payload.toString().split('.');

            if (checkForTwoDecimals.length === 2) {
                if (checkForTwoDecimals[1].length > 2) {
                    checkForTwoDecimals[1] = checkForTwoDecimals[1].substring(0,2);
                    state.exchangePocketValueFrom = Number(checkForTwoDecimals.join('.')).toFixed(2);
                }
            }

            if (state.exchangePocketValueTo > 0) {
                state.exchangePocketValueTo = state.exchangePocketValueTo.toFixed(2)
            }
        },
        setExchangePocketValueTo: (state, action) => {
            state.exchangeAllowed = true;

            let value = 1;

            if (action.payload && !isNaN(action.payload)) {
                if (Number(action.payload) !== 0) {
                    value = Number(action.payload);
                }
                state.exchangePocketValueTo = Number(action.payload);
            } else {
                state.exchangePocketValueTo = '';
            }

            if (state.exchangePocketValueTo === '') {
                state.exchangePocketValueFrom = '';
            } else if (Number(state.exchangePocketValueTo) === 0) {
                state.exchangePocketValueFrom = 0;
            } else {

                if (state.exchangePocketTo === state.exchangePocketFrom) {
                    state.exchangeAllowed = false;
                    state.exchangePocketValueFrom = value;
                } else if (state.exchangePocketTo === BASE_CURRENCY) {
                    if (state.currentRates.rates.hasOwnProperty(state.exchangePocketFrom)) {
                        state.exchangePocketValueFrom = (value * Number(state.currentRates.rates[state.exchangePocketFrom])).toFixed(4);
                    }
                } else if (state.currentRates.rates.hasOwnProperty(state.exchangePocketTo)) {
                    if (state.exchangePocketFrom === BASE_CURRENCY) {
                        state.exchangePocketValueFrom = value / state.currentRates.rates[state.exchangePocketTo];
                    } else if (state.currentRates.rates.hasOwnProperty(state.exchangePocketFrom)) {
                        state.exchangePocketValueFrom = (value / state.currentRates.rates[state.exchangePocketTo]) * state.currentRates.rates[state.exchangePocketFrom];
                    }
                }

            }

            let pocketFrom = state.pockets.find(p => p.currency === state.exchangePocketFrom);

            if (Number(pocketFrom.amount) < state.exchangePocketValueFrom  || Number(state.exchangePocketValueFrom) === 0) {
                state.exchangeAllowed = false;
            }

            let checkForTwoDecimals = action.payload.toString().split('.');

            if (checkForTwoDecimals.length === 2) {
                if (checkForTwoDecimals[1].length > 2) {
                    checkForTwoDecimals[1] = checkForTwoDecimals[1].substring(0,2);
                    state.exchangePocketValueTo = Number(checkForTwoDecimals.join('.')).toFixed(2);
                }
            }

            if (state.exchangePocketValueFrom > 0) {
                state.exchangePocketValueFrom = Number(state.exchangePocketValueFrom).toFixed(2)
            }
        },
        exchangePockets: (state) => {
            let pocketFrom = state.pockets.find(p => p.currency === state.exchangePocketFrom);
            let pocketTo = state.pockets.find(p => p.currency === state.exchangePocketTo);

            pocketFrom.amount = (Number(pocketFrom.amount) - Number(state.exchangePocketValueFrom)).toFixed(2);
            pocketTo.amount = (Number(pocketTo.amount) + Number(state.exchangePocketValueTo)).toFixed(2);

            state.exchangePocketValueFrom = '';
            state.exchangePocketValueTo = '';
        }
    },
    extraReducers: {
        [fetchExchangerates.fulfilled]: (state, action) => {
            state.ratesIsLoading = false;
            state.currentRates = action.payload;
        },
        [fetchExchangerates.rejected]: (state, action) => {
            state.ratesIsLoading = false;
        },
        [fetchExchangerates.pending]: (state, action) => {
            state.ratesIsLoading = true;
        }
    }
});

export const selectCurrentRates = state => state.myPocket.currentRates;
export const selectPockets = state => state.myPocket.pockets;
export const selectRatesIsLoading = state => state.myPocket.ratesIsLoading;
export const selectExchangePocketValueFrom = state => state.myPocket.exchangePocketValueFrom;
export const selectExchangePocketValueTo = state => state.myPocket.exchangePocketValueTo;
export const selectExchangeRate = state => state.myPocket.exchangeRate;
export const selectExchangeAllowed = state => state.myPocket.exchangeAllowed;
export const selectExchangePocketFrom = state => state.myPocket.pockets.find(p => p.currency === state.myPocket.exchangePocketFrom);
export const selectExchangePocketTo = state => state.myPocket.pockets.find(p => p.currency === state.myPocket.exchangePocketTo);
export const selectActivePockets = state => state.myPocket.pockets.find(p => p.currency === state.myPocket.mainPocket);
export const { setExchangePocketFrom, setExchangePocketTo, setExchangePocketValueFrom, setExchangePocketValueTo, exchangePockets } = myPocketSlice.actions;
export default myPocketSlice.reducer;