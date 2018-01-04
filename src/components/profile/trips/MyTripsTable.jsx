import React from 'react';
import { Link } from 'react-router-dom';

import moment from 'moment'

export default class MyTripsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedId: ''
        }
    }

    render() {
        return (
            <div className="container">
                <div className="table-header bold">
                    <div className="col-md-1">
                    </div>
                    <div className="col-md-2">
                        <span>Host</span>
                    </div>
                    <div className="col-md-2">
                        <span>Property</span>
                    </div>
                    <div className="col-md-3">
                        <span>Dates</span>
                    </div>
                    <div className="col-md-2">
                        <span>Actions</span>
                    </div>
                    <div className="col-md-2">
                        <span>Status</span>
                    </div>
                </div>
                {this.props.trips.map(trip => {
                    return (
                        <div className="row reservation-box">
                            <div className="col-md-1">
                                <div className="reservation-image-box">
                                    <span className="session-nav-user-thumb"></span>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="bold">{trip.hostName}</div>
                                <div>{trip.hostEmail}</div>
                                <div>{trip.hostPhone}</div>
                                {trip.hostLocAddress ? <div><a href={`https://etherscan.io/address/${trip.hostLocAddress}`} target="_blank">Loc Address</a></div> : ''}
                                {trip.hostEmail ? <div><span className="send-message-icon"></span><a href={`mailto:${trip.hostEmail}`}>Send Message</a></div> : ''}
                            </div>
                            <div className="col-md-2">
                                <div>{trip.listingName}</div>
                            </div>
                            <div className="col-md-3">
                                <div>{moment(new Date(trip.startDate)).format("DD MMM, YYYY")}<i aria-hidden="true" className="fa fa-long-arrow-right"></i>{moment(new Date(trip.endDate)).format("DD MMM, YYYY")}</div>
                            </div>
                            <div className="col-md-2">
                                <form onSubmit={(e) => { e.preventDefault(); this.setState({ selectedId: reservation.id}); this.captcha.execute() }}>>
                                    {trip.accepted ? <div>More actions coming soon!</div> : <div><button type="submit">Cancel</button></div>}
                                </form>
                                {/* <div><Link to="#">Report a problem</Link></div>
                                <div><Link to="#">Print Confirmation</Link></div> */}
                            </div>
                            <div className="col-md-2">
                                <div className="reservation-status bold">{trip.accepted ? "Accepted" : "Pending"}</div>
                            </div>
                        </div>
                    )
                })}
                <ReCAPTCHA
                    ref={el => this.captcha = el}
                    size="invisible"
                    sitekey="6LdCpD4UAAAAAPzGUG9u2jDWziQUSSUWRXxJF0PR"
                    onChange={token => { this.props.onTripCancel(this.state.selectedId, token); this.captcha.reset() }}
                />
            </div>
        );
    }
}