import React, { Component } from 'react';

class MultiMarkerGoogleMap extends Component {
    componentDidMount() {
        this.lat = this.props.lat ? this.props.lat : 0;
        this.lon = this.props.lon ? this.props.lon : 0;
        this.mapInstance = new window.google.maps.Map(this.map, {
            zoom: 12,
            center: { lat: this.lat, lng: this.lon }
        });

        this.markers = [];
        this.infoWindows = [];
        if (this.props.hotels) {
            this.placeMarkers(this.props.hotels, 0, this.props.hotels.length);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillReceiveProps(props) {
        const hasNewCoordinates = props.lat && props.lon && (props.lat !== this.lat || props.lon !== this.lon);
        if (hasNewCoordinates) {
            this.lat = props.lat;
            this.lon = props.lon;
            const latLng = new window.google.maps.LatLng(props.lat, props.lon);
            this.mapInstance.panTo(latLng);
        }

        const { hotels } = props;
        if (hotels) {
            if (props.isFiltered) {
                this.infoWindows = [];
                this.markers.forEach((marker) => {
                    marker.setMap(null);
                });
    
                this.placeMarkers(hotels);
            } else {
                this.placeMarkers(hotels, hotels.length - 1);
            }
        }
    }

    componentWillUnmount() {
        this.infoWindows = [];
        this.markers.forEach((marker) => {
            marker.setMap(null);
        });
    }

    placeMarkers(hotels, from, to) {
        if (hotels && hotels.length > 0) {
            from = from ? from : 0;
            to = to ? to : hotels.length;
            for (let i = from; i < to; i++) {
                const hotel = hotels[i];
                const marker = this.createMarker(hotel);
                const infoWindow = this.createInfoWindow(hotel);
                window.google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open(this.mapInstance, marker);
                });

                this.markers.push(marker);
                this.infoWindows.push(infoWindow);
            }
        }
    }

    createMarker(hotel) {
        return new window.google.maps.Marker({
            position: new window.google.maps.LatLng(hotel.lat, hotel.lon),
            title: hotel.name,
            map: this.mapInstance,
        });
    }

    createInfoWindow(hotel) {
        const content = `<div class="content">${hotel.name}</div>`;
        return new window.google.maps.InfoWindow({
            content: content,
        });
    }

    render() {
        return (
            <div ref={(map) => this.map = map} id='hotels-search-map' style={{ height: '470px', marginBottom: '80px' }}></div>
        );
    }
}

export default MultiMarkerGoogleMap;