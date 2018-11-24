import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ContextMenu, MenuItem, ContextMenuTrigger, connectMenu } from 'react-contextmenu'

import './index.css'

const MENU_TYPE = 'hello';

const targets = [{
    name: 'Banana'
}, {
    name: 'Apple'
}, {
    name: 'Papaya'
}, {
    name: 'Mango'
}, {
    name: 'Orange'
}, {
    name: 'Pineapple'
}];

function collect(props) {
    return props;
}

const DynamicMenu = (props) => {
    const { id, trigger } = props;
    const handleItemClick = trigger ? trigger.onItemClick : null;
    console.log(trigger)
    return (
        <ContextMenu id={id}>
            {trigger && <MenuItem onClick={handleItemClick} data={{ action: 'Added' }}>{`Add 1 ${trigger.name}`}</MenuItem>}
            {trigger && (
                trigger.allowRemoval
                    ? <MenuItem onClick={handleItemClick} data={{ action: 'Removed' }}>{`Remove 1 ${trigger.name}`}</MenuItem>
                    : <MenuItem disabled>{'Removal disabled'}</MenuItem>
            )}
        </ContextMenu>
    );
};

DynamicMenu.propTypes = {
    id: PropTypes.string.isRequired,
    trigger: PropTypes.shape({
        name: PropTypes.string.isRequired,
        onItemClick: PropTypes.func.isRequired,
        allowRemoval: PropTypes.bool
    }).isRequired
};

const ConnectedMenu = connectMenu(MENU_TYPE)(DynamicMenu);

export default class More extends Component {
    constructor(props) {
        super(props);

        this.state = { logs: [] };
    }

    handleClick = (e, data, target) => {
        const count = parseInt(target.getAttribute('data-count'), 10);

        if (data.action === 'Added') {
            target.setAttribute('data-count', count + 1);

            return this.setState(({ logs }) => ({
                logs: [`${data.action} 1 ${data.name}`, ...logs]
            }));
        }
        if (data.action === 'Removed' && count > 0) {
            target.setAttribute('data-count', count - 1);

            return this.setState(({ logs }) => ({
                logs: [`${data.action} 1 ${data.name}`, ...logs]
            }));
        }
        return this.setState(({ logs }) => ({
            logs: [` ${data.name} cannot be ${data.action.toLowerCase()}`, ...logs]
        }));
    }

    render() {
        const attributes = {
            'data-count': 0,
            className: 'example-multiple-targets well'
        };

        return (
            <div>
                <h3>Dynamic Menu</h3>
                <p>This demo shows usage of dynamically created menu on multiple targets.</p>
                <div className='pure-g'>
                    {targets.map((item, i) => (
                        <div key={i} className='pure-u-1-6'>
                            <ContextMenuTrigger
                                id={MENU_TYPE} holdToDisplay={1000}
                                name={item.name} onItemClick={this.handleClick}
                                friend={{name: item.name}}
                                allowRemoval={i % 2 === 0}
                                collect={collect} attributes={attributes}>
                                {item.name}
                            </ContextMenuTrigger>
                        </div>
                    ))}
                </div>
                <div>
                    {this.state.logs.map((log, i) => <p key={i}>{log}</p>)}
                </div>
                <ConnectedMenu />
            </div>
        );
    }
}