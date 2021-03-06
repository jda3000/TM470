import React from "react";
import {
    StyleSheet,
    View,
} from 'react-native';

import Timer from './Timer'
import SaveModal from "./SaveModal";
import Map from './Map'

import { http } from '../../services'

export default class RecordView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            locations: [],
            timer: 0,
            showModal: false,
            errors: null
        }

        this.map = React.createRef()
        this.timer = React.createRef()
        this.start = this.start.bind(this)
        this.resume = this.resume.bind(this)
        this.stop = this.stop.bind(this)
        this.resumeTimer = this.resumeTimer.bind(this)
        this.save = this.save.bind(this)
    }

    start() {
        this.map.current.startTracking()
    }

    stop() {
        this.map.current.stopTracking()
        this.setState({ ...this.state, showModal: true })
    }

    resume() {
        this.map.current.resumeTracking()
    }
    resumeTimer() {
        this.timer.current.resumeTimer()
        this.setState({ ...this.state, showModal: false })
    }
    save(form) {
        this.timer.current.handleReset()
        // clear form
        // clear errors
        this.setState({...this.state, errors: null})

        let coordinates = this.state.locations.map(location => {
            return [location.longitude, location.latitude]
        })
        let data = {
            // custom description or use today's date
            description: form.description ? form.description : new Date().toUTCString(),
            route: {
                type: 'LineString',
                coordinates: coordinates
            },
            start_time: form.start_time,
            end_time: new Date(),
            litter_collected_amount: form.litter_collected_amount,
            private: form.private
        }
        http.post('beats/api/beat_detail', data).then(
          () => {
                this.setState({locations: [], timer: 0, showModal: false })
                this.props.navigation.navigate('Home')
            }
        ).catch(
            error => {
                console.log('errors', error.response.data)
                // handle errors
                this.setState({ ...this.state, errors: error.response.data });
            }
        )

    }

    render() {
        return (
            <View style={ { flex: 1 } }>
                <Map
                    ref={ this.map }
                    locations={ this.state.locations }
                    onLocationChange={ (e) => this.setState({ ...this.state, locations: e }) }
                />
                <Timer
                    ref={ this.timer }
                    style={ styles.timer }
                    timer={ this.state.timer }
                    onTimerChange={ (e) => this.setState({ ...this.state, timer: e }) }
                    onStart={ this.start }
                    onStop={ this.stop }
                    onResume={ this.resume }
                    onReset={ this.reset }
                />

                <SaveModal
                    show={ this.state.showModal }
                    onResume={ this.resumeTimer }
                    onSave={ this.save }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    timer: {
        flex: 1
    }
});

