import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import reducers from './reducers';
import routes from './routes';

// const store = createStore(reducers);

const store = createStore(
    reducers,
	compose(
        applyMiddleware(reduxThunk)
    )
);

const history = syncHistoryWithStore(browserHistory, store);

render(
	<Provider store={store}>
		<Router history={history}>
			{ routes }
		</Router>
	</Provider>,
	document.getElementById('app')
);

if(process.env.NODE_ENV == 'development' && module.hot) {
	module.hot.accept('./reducers', () => {
		store.replaceReducer(require('./reducers').default);
	});
}
