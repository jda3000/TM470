import React from 'react';

import {
    View,
    Button
} from 'react-native';


class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
            isPaused: false
        }
        this.increment = React.createRef(null)
        this.handleStart = this.handleStart.bind(this);
        this.handleStop = this.handleStop.bind(this)
        this.resumeTimer = this.resumeTimer.bind(this)
    }


    handleStart() {
        this.props.onStart(true)
        this.setState({ isActive: true })
        this.setState({ isPaused: true })
        this.increment.current = setInterval(() => {
            this.props.onTimerChange(this.props.timer + 1)
        }, 1000)
    }

    handleStop() {
        this.props.onStop(true)
        clearInterval(this.increment.current)
        this.setState({ isPaused: false })
    }

    resumeTimer() {
        this.props.onResume(true)
        this.setState({ isPaused: true })
        this.increment.current = setInterval(() => {
            this.props.onTimerChange(this.props.timer + 1)
        }, 1000)
    }

    handleReset() {
        this.setState({
            isActive: false,
            isPaused: false
            // timer: 0
        })
    }

    formatTime() {
        const getSeconds = `0${(this.props.timer % 60)}`.slice(-2)
        const minutes = `${Math.floor(this.props.timer / 60)}`
        const getMinutes = `0${minutes % 60}`.slice(-2)
        const getHours = `0${Math.floor(this.props.timer / 3600)}`.slice(-2)

        return `${getHours} : ${getMinutes} : ${getSeconds}`
    }


    render() {
        let button;

        if (!this.state.isActive && !this.state.isPaused) button = <Button title="Start" onPress={ this.handleStart } />
        else {
            if (this.state.isPaused) button = <Button title="Stop" onPress={ this.handleStop } />
            else button = <Button title="Resume" onPress={ this.resume } />
        }

        return (
            <View style={ {
                backgroundColor: 'powderblue',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',

                padding: 2
            } }>
                <View>
                    <Button title={ this.formatTime() } />
                </View>
                <View>
                    { button }
                </View>

            </View>
        )
    }
}

export default Timer
