import React, { Component } from 'react';

import LogReader from '../components/LogReader/LogReader';

class Home extends Component {
	render() {
		return (
			<div className="container">
				<div className="row pt-4">
					<div className="col-md-2 col-xs-12">
						<div
							className="card text-white bg-primary mb-3"
							style={{ maxWidth: '18rem' }}
						>
							<div className="card-header">Header</div>
							<div className="card-body">
								<h5 className="card-title">Primary card title</h5>
								<p className="card-text">Some quick example text to build</p>
							</div>
						</div>
					</div>
					<div className="col-md-10 col-xs-12">
						<LogReader />
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
