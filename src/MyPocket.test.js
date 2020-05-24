import React from 'react';
import App from './App.jsx';
import renderer from 'react-test-renderer';
import thunk from "redux-thunk";
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([thunk]);

describe('App component test', () => {
    let store;
    let app;

    beforeEach(() => {
        store = mockStore({
            myPocket: {
                pockets: [
                // Setting default pockets
                {
                    currency: 'GBP',
                    amount: 0,
                    symbol: '£',
                },
                {
                    currency: 'EUR',
                    amount: 1000,
                    symbol: '€',
                },
                {
                    currency: 'USD',
                    amount: 2500,
                    symbol: '$',
                },
                ],
                exchangePocketFrom: 'EUR',
                exchangePocketTo: 'GBP',
                exchangePocketValueFrom: '',
                exchangePocketValueTo: '',
                currentRates: null,
                ratesIsLoading: false,
                exchangeRate: '',
                exchangeAllowed: false
            }
        });

        app = renderer.create(
            <Provider store={store}>
                <App />
            </Provider>
        );
    });

    it('App main component mounts', () => {
        expect(app).toMatchSnapshot();
    });

    it('All main elements exists', () => {
        let mainWrapper = app.root.findByProps({'id': 'exchange-pocket'});
        let fromDropdown = app.root.findByProps({'id': 'pocket-from'});
        let toDropdown = app.root.findByProps({'id': 'pocket-to'});
        let valueFromInput = app.root.findByProps({'id': 'value-from'});
        let valueToInput = app.root.findByProps({'id': 'value-to'});
        let makeExchangeBtn = app.root.findByProps({'id': 'make-exchange'});
        expect(mainWrapper).toBeTruthy();
        expect(fromDropdown).toBeTruthy();
        expect(toDropdown).toBeTruthy();
        expect(valueFromInput).toBeTruthy();
        expect(valueToInput).toBeTruthy();
        expect(makeExchangeBtn).toBeTruthy();
    });
});