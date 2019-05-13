import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';

import Home from './views/Home';
import NotFound from './views/NotFound';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Layout>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route component={NotFound} />
					</Switch>
				</Layout>
			</BrowserRouter>
		);
	}
}

export default App;
