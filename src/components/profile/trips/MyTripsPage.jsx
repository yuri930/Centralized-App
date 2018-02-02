import { cancelTrip, getMyTrips } from '../../../requester';

import { Link } from 'react-router-dom';
import MyTripsTable from './MyTripsTable';
import { NotificationManager } from 'react-notifications';
import CancellationModal from '../../common/modals/CancellationModal';
import Pagination from 'rc-pagination';
import PropTypes from 'prop-types';
import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default class MyTripsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            trips: [],
            loading: true,
            totalTrips: 0,
            currentPage: 1,
            selectedTripId: null,
            cancellationText: '',
            showCancelTripModal: false,
        };

        this.onPageChange = this.onPageChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onTripCancel = this.onTripCancel.bind(this);
        this.onTripSelect = this.onTripSelect.bind(this);
    }

    componentDidMount() {
        let search = this.props.location.search.split('?');
        let id = null;
        if (search.length > 1) {
            let pairs = search[1].split('&');
            for (let pair of pairs) {
                let tokens = pair.split('=');
                if (tokens[0] === 'id') {
                    id = Number(tokens[1]);
                    break;
                }
            }
        }
        getMyTrips('?page=0').then((data) => {
            this.setState({ trips: data.content, totalTrips: data.totalElements, loading: false, selectedTripId: id });
            if (id) {
                NotificationManager.success('Booking Request Sent Successfully, your host will get back to you with additional questions.', 'Reservation Operations');
            }
        });
    }

    onTripCancel() {
        this.cancelCaptcha.execute();
    }

    cancelTrip(captchaToken) {
        const id = this.state.selectedTripId;
        const message = this.state.cancellationText;
        let messageObj = { message: message };
        cancelTrip(id, messageObj, captchaToken)
            .then(response => {
                if(response.success) {
                    this.setTripIsAccepted(id, false);
                    NotificationManager.success(response.message, 'Reservation Operations');
                } else {
                    NotificationManager.error(response.message, 'Reservation Operations');
                }
            });
    }

    setTripIsAccepted(tripId, isAccepted) {
        const trips = this.state.trips.map(trip => {
            if(trip.id === tripId) {
                trip.accepted = isAccepted;
            }
            return trip;
        });
        this.setState({ trips: trips });
    }

    onPageChange(page) {
        this.setState({
            currentPage: page,
            loadingListing: true
        });

        getMyTrips(`?page=${page - 1}`).then(data => {
            this.setState({
                trips: data.content,
                totalTrips: data.totalElements,
                loadingListing: false
            });
        });
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    openModal(name) {
        this.setState({ [name]: true });
    }

    closeModal(name) {
        this.setState({ [name]: false });
    }

    onTripSelect(id) {
        this.setState({ selectedTripId: id });
    }

    render() {
        if (this.state.loading) {
            return <div className="loader"></div>;
        }

        const textItemRender = (current, type, element) => {
            if (type === 'prev') {
                return <div className="rc-prev">&lsaquo;</div>;
            }
            if (type === 'next') {
                return <div className="rc-next">&rsaquo;</div>;
            }
            return element;
        };

        return (
            <div className="my-reservations">
                <ReCAPTCHA
                    ref={el => this.cancelCaptcha = el}
                    size="invisible"
                    sitekey="6LdCpD4UAAAAAPzGUG9u2jDWziQUSSUWRXxJF0PR"
                    onChange={token => { this.cancelTrip(token); this.cancelCaptcha.reset(); }} />

                <CancellationModal
                    name={'showCancelTripModal'}
                    value={this.state.cancellationText}
                    title={'Cancel Trip'}
                    text={'Tell your host why do you want to cancel your trip.'}
                    onChange={this.onChange}
                    isActive={this.state.showCancelTripModal} 
                    onClose={this.closeModal}
                    onSubmit={this.onTripCancel} />

                <section id="profile-my-reservations">
                    <div className="container">
                        <h2>Upcoming Trips ({this.state.totalTrips})</h2>
                        <hr />
                        <MyTripsTable
                            trips={this.state.trips}
                            onTripSelect={this.onTripSelect}
                            onTripCancel={() => this.openModal('showCancelTripModal')} />

                        <div className="pagination-box">
                            {this.state.totalListings !== 0 && <Pagination itemRender={textItemRender} className="pagination" defaultPageSize={20} showTitle={false} onChange={this.onPageChange} current={this.state.currentPage} total={this.state.totalTrips} />}
                        </div>

                        <div className="my-listings">
                            <Link className="btn btn-primary create-listing" to="#">Print this page</Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

MyTripsPage.propTypes = {
    location: PropTypes.object
};