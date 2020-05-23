import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchExchangerates,
    selectCurrentRates,
    // selectRatesIsLoading,
    selectPockets,
    selectExchangePocketFrom,
    selectExchangePocketTo,
    setExchangePocketFrom,
    setExchangePocketTo,
    selectExchangePocketValueFrom,
    selectExchangePocketValueTo,
    setExchangePocketValueFrom,
    setExchangePocketValueTo,
    selectExchangeRate,
    selectExchangeAllowed,
    exchangePockets
} from './myPocketSlice.js';
import SelectPocket from './SelectPocket.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faChartLine, faMinus, faPlus, faSync } from '@fortawesome/free-solid-svg-icons';

function ExchangePocket() {
    const currencies = useSelector(selectCurrentRates);
    // const ratesIsLoading = useSelector(selectRatesIsLoading);
    const myPockets = useSelector(selectPockets);
    const exchangePocketFrom = useSelector(selectExchangePocketFrom);
    const exchangePocketTo = useSelector(selectExchangePocketTo);
    const exchangePocketValueFrom = useSelector(selectExchangePocketValueFrom);
    const exchangePocketValueTo = useSelector(selectExchangePocketValueTo);
    const exchangeRate = useSelector(selectExchangeRate);
    const exchangeAllowed = useSelector(selectExchangeAllowed);

    const dispatch = useDispatch();

    // https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies

    useEffect(() => {
        dispatch(fetchExchangerates());
        setInterval(function() {
            dispatch(fetchExchangerates());
          }, 10000);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
       if (currencies && !exchangePocketValueFrom) {
            dispatch(setExchangePocketValueFrom(''));
       }
    }, [currencies]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (currencies) {
            dispatch(setExchangePocketValueFrom(exchangePocketValueFrom));
        }
    }, [exchangePocketFrom, exchangePocketTo]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="exchange-pocket">
            <div className="form-group row">
                <div className="col-sm-6">
                    <SelectPocket 
                        activePocket={exchangePocketFrom}
                        allPockets={myPockets}
                        onPocketClick={setExchangePocketFrom}
                    />
                </div>
                <div className="col-sm-6">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faMinus} />
                            </span>
                        </div>
                        <input 
                            type="number"
                            className="form-control"
                            id="valueFrom"
                            step=".01"
                            value={exchangePocketValueFrom}
                            onChange={(e) => dispatch(setExchangePocketValueFrom(e.target.value))}
                        />
                    </div>
                </div>
            </div>
            <div className="text-center">
                <FontAwesomeIcon icon={faExchangeAlt} size="2x"/>
                <div className="mb-3">
                    <span className="badge badge-info">
                        <FontAwesomeIcon icon={faChartLine} /> {exchangeRate}
                    </span>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-sm-6">
                    <SelectPocket 
                        activePocket={exchangePocketTo}
                        allPockets={myPockets}
                        onPocketClick={setExchangePocketTo}
                    />
                </div>
                <div className="col-sm-6">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faPlus} />
                            </span>
                        </div>
                        <input
                            type="number"
                            className="form-control"
                            id="valueFrom"
                            step=".01"
                            value={exchangePocketValueTo}
                            onChange={(e) => dispatch(setExchangePocketValueTo(e.target.value))}
                        />
                    </div>
                </div>
            </div>
            <div className="form-group text-center">
                <button disabled={!exchangeAllowed} className="btn btn-primary" onClick={() => dispatch(exchangePockets())}>
                    <FontAwesomeIcon icon={faSync}/> Exchange
                </button>
            </div>
        </div>
    );
}

export default ExchangePocket;
