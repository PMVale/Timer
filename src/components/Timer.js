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
      });
    }
  };

  handleStart = () => {
    this.setState({isRunning: true});
  };

  handleReset = () => {
    this.setState({
      playSound: false,
      isRunning: false,
      inputHours: 0,
      inputMinutes: 0,
      inputSeconds: 0,
    });
  };

  handleChange = ({target}) => {
    const {name, value} = target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { inputHours, inputMinutes, inputSeconds, playSound, isRunning} = this.state;
    return (
      <div className='timer-body'>
        {!playSound && (
          <section className='timer-display'>
            <p>
              {`${inputHours}hr`} {`${inputMinutes}min`} {`${inputSeconds}s`}
            </p>
          </section>
        )}
        {playSound && (
          <section className='timer-alert'>
            <div>
              <p>Acabou o tempo !</p>  
              <audio autoPlay src={alarm} />
            </div>
          </section>
        )}
        <section className='timer-inputs'>
          <label>
            <input type='number' value={inputHours} name='inputHours' onChange={this.handleChange} min={0} max={60} disabled={isRunning} />
            hr
          </label>
          <label>
            <input type='number' value={inputMinutes} name='inputMinutes' onChange={this.handleChange} min={0} max={60} disabled={isRunning} />
            min
          </label>
          <label>
            <input type='number' value={inputSeconds} name='inputSeconds' onChange={this.handleChange} min={0} max={60} disabled={isRunning} />
            s
          </label>
          <button type='button' className='btn' onClick={ this.handleStart }>
            <i className="bi bi-play-fill"></i>
          </button>
          <button type='button' className='btn' onClick={ this.handleReset }>
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </section>
      </div>
    );
  }
}

export default Timer;