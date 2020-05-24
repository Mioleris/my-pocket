import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

function PocketEvent(props) {

    const dispatch = useDispatch();

    let formatedPocketName = (pocket) => {
        return (
            <span>
                <strong>{pocket.currency}</strong> - {pocket.amount} {pocket.symbol}
            </span>
        );
    }

    return (
        <div className="dropdown" id={props.id}>
            <button className="btn dropdown-toggle" type="button" id={`${props.id}-main-value`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                { formatedPocketName(props.activePocket) }
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {props.allPockets.map((pocket, index) => {
                    return (
                        <button id={`${props.id}-select-${pocket.currency.toLowerCase()}`} key={index} className="dropdown-item" onClick={ () => dispatch(props.onPocketClick(pocket.currency)) }>
                            { formatedPocketName(pocket) }
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

PocketEvent.propTypes = {
    activePocket: PropTypes.object,
    allPockets: PropTypes.array,
    onPocketClick: PropTypes.func,
    id: PropTypes.string
};

export default PocketEvent;
