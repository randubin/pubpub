import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const UserSettings = React.createClass({
	propTypes: {
		input: PropTypes.string,
	},

	getDefaultProps: function() {
		
	},

	render: function() {
		return (
			<div style={styles.container}>
				<div style={styles.header}>Settings</div>
			</div>
		);
	}
});

export default Radium(UserSettings);

styles = {
	header: {
		color: 'red',
	},
};