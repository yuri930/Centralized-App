import BasicsAside from '../aside/BasicsAside';
import Counter from '../counter/Counter';
import Dropdown from '../dropdown/Dropdown';
import LabeledBedroomCounter from '../counter/LabeledBedroomCounter';
import ListingCrudNav from '../navigation/ListingCrudNav';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

export default function CreateListingAccommodation(props) {
    const { guestsIncluded, bedroomsCount, bedrooms, bathrooms } = props.values;
    const bedroomRows = bedrooms.map((bedroom, i) => {
        return <div key={i}>
            <h3>Bedroom {i + 1} (What type of beds are available in this room)?</h3>
            <LabeledBedroomCounter
                label="Single Bed"
                name="singleBedCount"
                bedroom={i}
                value={bedrooms[i].singleBedCount}
                onChange={props.updateBedCount}
            />

            <LabeledBedroomCounter
                label="Double Bed"
                name="doubleBedCount"
                bedroom={i}
                value={bedrooms[i].doubleBedCount}
                onChange={props.updateBedCount}
            />

            <LabeledBedroomCounter
                label="King Bed"
                name="kingBedCount"
                bedroom={i}
                value={bedrooms[i].kingBedCount}
                onChange={props.updateBedCount}
            />
        </div>;
    });

    let bedroomsArray = ['1 bedroom'];

    for (let i = 2; i <= 10; i++) {
        bedroomsArray.push(i + ' bedrooms');
    }

    return (
        <div>
            <ListingCrudNav progress='33%' />
            <div className="container">
                <div className="row">
                    <div className="listings create">
                        <div className="col-md-3">
                            <BasicsAside routes={props.routes} />
                        </div>
                        <div className="reservation-hotel-review-room col-md-9">

                            <div>
                                <h2>Accommodation</h2>
                                <hr />
                            </div>

                            <div>
                                <h3>How many guests can stay in your place?</h3>
                                <label>
                                    <span className="counter-label">Guests:</span>
                                    <Counter
                                        name="guestsIncluded"
                                        value={guestsIncluded}
                                        onChange={props.updateCounter} />
                                </label>
                            </div>

                            <br />

                            <div>
                                <h3>How many bedrooms can your guests use?</h3>
                                <Dropdown
                                    className="bedroom-counter l-select"
                                    name="bedroomCount"
                                    options={bedroomsArray}
                                    value={bedroomsCount}
                                    onChange={props.updateBedrooms}
                                />
                            </div>

                            <div>
                                <h2>Sleeping arrangement</h2>
                                <hr />
                                {bedroomRows}
                            </div>

                            <div>
                                <h2>Bathrooms</h2>
                                <hr />
                                <h3>How many bathrooms can your guests use?</h3>

                                <label>
                                    <span className="counter-label">Bathrooms:</span>
                                    <Counter
                                        name="bathrooms"
                                        value={bathrooms}
                                        onChange={props.updateCounter} />
                                </label>
                            </div>

                            <br />

                        </div>
                    </div>
                </div>
            </div>
            <div className="navigation col-md-12">
                <div className="col-md-3">
                </div>
                <div className="col-md-7">
                    <NavLink to={props.prev} className="btn btn-default btn-back" id="btn-continue">
                        <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
                        &nbsp;Back</NavLink>
                    <NavLink to={props.next} className="btn btn-primary btn-next" id="btn-continue" onClick={() => props.updateProgress(2)}>Next</NavLink>
                </div>
            </div>
        </div>
    );
}

CreateListingAccommodation.propTypes = {
    values: PropTypes.any,
    onChange: PropTypes.func,
    updateBedCount: PropTypes.func,
    updateProgress: PropTypes.func,
    updateBedrooms: PropTypes.func,
    updateCounter: PropTypes.func,
    prev: PropTypes.string,
    next: PropTypes.string,
};