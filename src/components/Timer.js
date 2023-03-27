import React, { Component } from 'react';
import alarm from '../assets/alarm2.mp3';
import '../styles/Timer.css';

class Timer extends Component {
  state = {
    inputHours: 0,
    inputMinutes: 0,
    inputSeconds: 0,
    isRunning: false,
    playSound: false,
    hasFinished: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const { inputHours, inputMinutes, inputSeconds, isRunning} = this.state;
    const checkSeconds = prevState.inputSeconds !== inputSeconds || prevState.inputSeconds >= 1;
    const checkMinutes = prevState.inputMinutes !== inputMinutes || prevState.inputMinutes >= 1 || checkSeconds;
    const checkHours = prevState.inputHours !== inputHours || prevState.inputHours >= 1 || checkMinutes;
    if (checkHours && isRunning) {
      this.handleTimer();
    }
  }

  handleTimer = () => {
    const { inputHours, inputMinutes, inputSeconds} = this.state;
    setTimeout(() => {
      if (inputHours > 0 && (inputMinutes + inputSeconds) === 0 ) {
        this.setState((prevState) => ({
          inputHours: prevState.inputHours - 1,
          inputMinutes: 59,
          inputSeconds: 59,
        }));
      }
      if (inputMinutes > 0 && inputSeconds === 0) {
        this.setState((prevState) => ({
          inputMinutes: prevState.inputMinutes - 1,
          inputSeconds: 59,
        }));
      }
      if (inputSeconds > 0) {
        this.setState((prevState) => ({
          inputSeconds: prevState.inputSeconds - 1,
        }));
      }
    }, 1000);
    const total = inputHours + inputMinutes + inputSeconds;
    if (total === 0) {
      this.setState({
        isRunning: false,
        playSound: true,
        hasFinished: true,
      });
    }
  };

  handleStart = () => {
    const {isRunning} = this.state;
    if (!isRunning) {
      this.setState({isRunning: true});
    } else {
      this.setState({isRunning: false});
    }
  };

  handleReset = () => {
    this.setState({
      playSound: false,
      isRunning: false,
      hasFinished: false,
      inputHours: 0,
      inputMinutes: 0,
      inputSeconds: 0,
    });
  };

  handleMute = () => {
    const {playSound, hasFinished} = this.state;
    if (playSound && hasFinished) {
      this.setState({playSound: false});
    }
    if (!playSound && hasFinished) {
      this.setState({playSound: true});
    }
  };

  handleChange = ({target}) => {
    const {name, value} = target;
    this.setState({
      [name]: value
    }, () => {
      const {inputMinutes, inputSeconds} = this.state;
      if (inputMinutes > 60) {
        this.setState({inputMinutes: 60});
      }
      if (inputMinutes < 0) {
        this.setState({inputMinutes: 0});
      }
      if (inputSeconds > 60) {
        this.setState({inputSeconds: 60});
      }
      if (inputSeconds < 0) {
        this.setState({inputSeconds: 0});
      }
    });
  };

  render() {
    const { inputHours, inputMinutes, inputSeconds, playSound, isRunning, hasFinished} = this.state;
    return (
      <div className='timer-body'>
        {!hasFinished && (
          <section className='timer-display'>
            <p>
              {`${inputHours}hr`} {`${inputMinutes}min`} {`${inputSeconds}s`}
            </p>
          </section>
        )}
        {hasFinished && (
          <section className='timer-alert'>
            <div>
              <p>Acabou o tempo !</p>  
              {playSound && <audio autoPlay src={alarm} />}
            </div>
          </section>
        )}
        <section className='timer-inputs'>
          <label>
            <input type='number' value={inputHours} name='inputHours' onChange={this.handleChange} min={0} max={60} disabled={isRunning} />
            hr
          </label>
          <label>
            <input type='number' value={inputMinutes} name='inputMinutes' onChange={this.handleChange} min={0} max={60} maxLength={2} disabled={isRunning} />
            min
          </label>
          <label>
            <input type='number' value={inputSeconds} name='inputSeconds' onChange={this.handleChange} min={0} max={60} maxLength={2} disabled={isRunning} />
            s
          </label>
          <button type='button' className='btn' onClick={ this.handleStart }>
            {!isRunning ? <i className="bi bi-play-fill"></i> : <i className="bi bi-pause-fill"></i> }
          </button>
          <button type='button' className='btn' onClick={ this.handleReset }>
            <i className="bi bi-arrow-clockwise"></i>
          </button>
          <button type='button' className='btn' onClick={ this.handleMute }>
            {!playSound ? <i className="bi bi-volume-mute-fill"></i> : <i className="bi bi-volume-up-fill"></i>}
          </button>
        </section>
      </div>
    );
  }
}

export default Timer;