import React, { Component } from 'react';
import { subscribeToLog, unsubscribeToLog } from '../../utils/socket';

export default class extends Component {
	state = {
		lines: []
	};
	componentDidMount() {
		subscribeToLog(line => {
			const lines = [...this.state.lines];
			if (lines.length < 1000) {
				lines.push(line);
			} else {
				lines.shift();
				lines.push(line);
			}
			this.setState(
				{
					lines: lines
				},
				() => {
					const objDiv = document.getElementById('log-code');
					objDiv.scrollTop = objDiv.scrollHeight;
				}
			);
		});
	}
	componentWillUnmount() {
		unsubscribeToLog();
	}
	render() {
		return (
			<pre>
				<code
					id="log-code"
					className="html hljs xml"
					style={{
						height: '70vh'
					}}
				>
					{this.state.lines.join('\n')}
				</code>
			</pre>
		);
	}
}
