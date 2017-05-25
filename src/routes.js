import React from 'react';
import { Route, IndexRoute } from 'react-router';

import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default (
	<Route path="/">
		<IndexRoute component={HomePage} />
		<Route path='*' component={NotFoundPage} />
	</Route>
);
