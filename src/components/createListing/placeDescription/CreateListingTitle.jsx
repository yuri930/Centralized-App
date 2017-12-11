import React from 'react';
import { NavLink } from 'react-router-dom';

import CreateListingPlaceDescriptionAside from './CreateListingPlaceDescriptionAside';

export default class CreateListingTitle extends React.Component {
    render() {
        return (
            <div>
                <CreateListingPlaceDescriptionAside />
                <h1>Title</h1>
                <br/>
                <NavLink to="/listings/create/location" className="btn btn-default" id="btn-continue">Back</NavLink>
                <NavLink to="/listings/create/description" className="btn btn-primary" id="btn-continue">Continue</NavLink>
            </div>
        );
    }
}