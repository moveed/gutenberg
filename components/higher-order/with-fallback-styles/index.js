/**
 * External dependencies
 */
import { findKey, isEqual } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

export default ( mapNodeToProps ) => ( WrappedComponent ) => {
	return class extends Component {
		constructor() {
			super( ...arguments );
			this.nodeRef = null;
			this.state = {
				fallbackStyles: undefined,
				grabStylesCompleted: false,
			};

			this.bindRef = this.bindRef.bind( this );
		}

		bindRef( node ) {
			if ( ! node ) {
				return;
			}
			this.nodeRef = node;
		}

		componentDidMount() {
			this.grabFallbackStyles();
		}

		componentDidUpdate() {
			this.grabFallbackStyles();
		}

		grabFallbackStyles() {
			const { grabStylesCompleted, fallbackStyles } = this.state;
			if ( this.nodeRef && ! grabStylesCompleted ) {
				const newFallbackStyles = mapNodeToProps( this.nodeRef, this.props );
				if ( ! isEqual( newFallbackStyles, fallbackStyles ) ) {
					this.setState( {
						fallbackStyles: newFallbackStyles,
						grabStylesCompleted: ! findKey( newFallbackStyles, ( obj ) => obj === undefined ),
					} );
				}
			}
		}

		render() {
			return (
				<div ref={ this.bindRef }>
					<WrappedComponent { ...this.props } { ...this.state.fallbackStyles } />
				</div>
			);
		}
	};
};