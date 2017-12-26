import React from 'react';
import { withRouter } from 'react-router-dom';

import BigCalendar from "react-big-calendar";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getCalendarByListingIdAndDateRange, getMyReservations, getPropertyById, publishCalendarSlot } from "../../../requester";
import moment from 'moment';
import CalendarAside from './CalendarAside';
import Calendar from './Calendar';
import ProfileHeader from '../ProfileHeader';
import Footer from '../../Footer';


class CalendarPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listing: null,
            events: null,
            prices: null,
            reservations: null,
            selectedDay: '',
            selectedDate: '',
            available: 'true',
            price: ''
        };

        this.onCancel = this.onCancel.bind(this);
        this.onSelectSlot = this.onSelectSlot.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    componentDidMount() {
        let now = new Date();
        let end = new Date();
        const DAY_INTERVAL = 60;
        end.setUTCHours(now.getUTCHours() + 24 * DAY_INTERVAL);
        getCalendarByListingIdAndDateRange(
            this.props.match.params.id,
            now,
            end,
            0,
            DAY_INTERVAL
        ).then(res => {
            let events = [];
            for (let dateInfo of res.content) {
                let color = dateInfo.available ? "white" : "lightcoral";
                events.push(
                    {
                        "title": <span className="calendar-price bold">${dateInfo.price}</span>,
                        "start": new Date(dateInfo.date),
                        "end": new Date(dateInfo.date),
                        "allDay": true
                    }
                )
            }

            this.setState({ prices: events });
        });

        getMyReservations()
            .then(res => {
                let reservations = res.content.filter(r => r.listingId == this.props.match.params.id);
                let events = [];
                for (let reservation of reservations) {
                    let event = {
                        "title": <span className="calendar-reservation-event">{reservation.guestName}</span>,
                        "start": new Date(reservation.startDate),
                        "end": new Date(reservation.endDate).setDate(new Date(reservation.endDate).getDate() + 1),
                        "isSelected": true
                    };
                    events.push(event);
                }


                this.setState({
                    reservations: events
                });
            });

        getPropertyById(this.props.match.params.id)
            .then(res => {
                this.setState({ listing: res.content });
            });
    }

    mergeEvents(prices, reservations) {
        let myArray = prices;
        for (let i = 0; i <= reservations.length - 1; i++) {
            let reservation = reservations[i];

            let reservationStartDate = new Date(reservation["start"]);
            let reservationEndDate = new Date(reservation["end"]);

            for (let d = reservationStartDate; d < reservationEndDate; d.setDate(d.getDate() + 1)) {
                for (let i = myArray.length - 1; i >= 0; i--) {
                    if (new Date(myArray[i].start).getTime() === new Date(d).getTime()) {
                        myArray.splice(i, 1);
                    }
                }
            }
        }
    }

    onCancel() {
        this.setState({ selectedDay: null, date: null });
    }

    onSelectSlot(e) {
        let date = e.start;
        let day = moment(e.start).format('DD');

        this.setState({ selectedDay: day, selectedDate: date });
    }

    onSubmit() {
        let listingId = this.props.match.params.id;

        let slotInfo = {
            date: moment(this.state.selectedDate).format('YYYY-MM-DD'),
            price: this.state.price,
            available: this.state.available
        }
        publishCalendarSlot(listingId, slotInfo).then((res) => {
            if (res.status === 200) {
                this.setState({ selectedDay: null, price: null });
                this.componentDidMount();
            }
        })
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        if (this.state.listing === null || this.state.prices === null || this.state.reservations === null) {
            return <div>Loading...</div>
        }

        this.mergeEvents(this.state.prices, this.state.reservations);

        let allEvents = this.state.prices.concat(this.state.reservations);

        return (
            <div>
                <ProfileHeader />
                <div className="col-md-12">
                    <div className="container">
                        <Calendar allEvents={allEvents}
                            onCancel={this.onCancel}
                            onSelectSlot={this.onSelectSlot}
                            selectedDay={this.state.selectedDay}
                            selectedDate={this.state.selectedDate}

                            price={this.state.price}
                            available={this.state.available}
                            onSubmit={this.onSubmit}
                            onChange={this.onChange} />
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}


export default withRouter(CalendarPage);



