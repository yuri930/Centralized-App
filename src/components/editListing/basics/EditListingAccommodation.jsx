import Counter from '../Counter';
import Dropdown from '../Dropdown';
import EditListingBasicsAside from './EditListingBasicsAside';
import LabeledBedroomCounter from '../LabeledBedroomCounter';
import NavEditListing from '../NavEditListing';
import { NavLink } from 'react-router-dom';
import React from 'react';

export default class EditListingAccommodation extends React.Component {

    render() {
        const { listingId, guestsIncluded, bedroomsCount, bedrooms, bathrooms, isInProgress } = this.props.values;
        const bedroomRows = bedrooms.map((bedroom, i) => {
            return <div key={i}>
                <h3>Bedroom {i + 1} (What type of beds are available in this room)?</h3>
                <LabeledBedroomCounter
                    label="Single Bed"
                    name="singleBedCount"
                    bedroom={i}
                    value={bedrooms[i].singleBedCount}
                    onChange={this.props.updateBedCount}
                />

                <LabeledBedroomCounter
                    label="Double Bed"
                    name="doubleBedCount"
                    bedroom={i}
                    value={bedrooms[i].doubleBedCount}
                    onChange={this.props.updateBedCount}
                />

                <LabeledBedroomCounter
                    label="King Bed"
                    name="kingBedCount"
                    bedroom={i}
                    value={bedrooms[i].kingBedCount}
                    onChange={this.props.updateBedCount}
                />
            </div>;
        });

        return (
            <div>
                <NavEditListing progress='33%' />
                <div className="container">
                    <div className="row">
                        <div className="listings create">
                            <div className="col-md-3">
                                <EditListingBasicsAside listingId={listingId} />
                            </div>
                            <div className="reservation-hotel-review-room col-md-9">

                                <div>
                                    <h2>Accommodation</h2>
                                    <hr />
                                </div>

                                <div>
                                    <h3>How many guests can stay in your place?</h3>
                                    <label>Guests:</label>
                                    <Counter
                                        name="guestsIncluded"
                                        value={guestsIncluded}
                                        onChange={this.props.updateCounter} />
                                </div>

                                <br />

                                <div>
                                    <h3>How many bedrooms can your guests use?</h3>
                                    <Dropdown
                                        name="bedroomsCount"
                                        options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                        value={bedroomsCount}
                                        onChange={this.props.updateBedrooms} />
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

                                    <label>Bathrooms:</label>
                                    <Counter
                                        name="bathrooms"
                                        value={bathrooms}
                                        onChange={this.props.updateCounter} />
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
                        <NavLink to={`/profile/listings/edit/placetype/${listingId}`} className="btn btn-default btn-back" id="btn-continue">
                            <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
                            &nbsp;Back</NavLink>
                        <NavLink to={`/profile/listings/edit/facilities/${listingId}`} className="btn btn-primary btn-next" id="btn-continue" onClick={() => { if (isInProgress) { this.props.updateProgress(3); } }} >Next</NavLink>
                    </div>
                </div>
            </div>
        );
    }
}