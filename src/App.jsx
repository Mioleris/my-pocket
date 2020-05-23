import React from 'react';
import ExchangePocket from './features/my-pocket/ExchangePocket.jsx';

function App() {
    return (
        <div id="app" className="container">
            <div className="row">
                <div className="col-lg-6 col-md-8 offset-lg-3 offset-md-2">
                    <h1 className="text-center mt-5 mb-5">My pocket</h1>
                    <div className="card bg-light">
                        <div className="card-body">
                            <ExchangePocket/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
