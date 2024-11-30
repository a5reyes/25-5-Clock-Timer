import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      session: 25,
      running: false,
      isSession: true,
    };
    this.intervalRef = React.createRef();
  }

  formatTime = (minutes, seconds) => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  countdown = () => {
    const timeLeft = document.getElementById("time-left");
    let time = timeLeft.textContent;
    let [mins, secs] = time.split(":").map(Number);
    if (secs === 0 && mins === 0) {
      clearInterval(this.intervalRef.current);
      const audio = document.getElementById("beep");
      if (audio) {
        audio.play();
      }
      if (this.state.isSession) {
        this.setState({ isSession: false });
        this.startBreak();
      } else {
        this.setState({ isSession: true });
        this.startSession();
      }
    } else {
      if (secs === 0) {
        mins--;
        secs = 59;
      } else {
        secs--;
      }
      let timeDisplay = this.formatTime(mins, secs);
      timeLeft.textContent = timeDisplay;
    }
  };

  startBreak = () => {
    const timeLeft = document.getElementById("time-left");
    const breakTime = this.state.break * 60;
    const mins = Math.floor(breakTime / 60);
    const secs = breakTime % 60;
    timeLeft.textContent = this.formatTime(mins, secs);
    document.getElementById("timer-label").textContent = "Break time";
    this.intervalRef.current = setInterval(this.countdown, 1000);
  };

  startSession = () => {
    const timeLeft = document.getElementById("time-left");
    const sessionTime = this.state.session * 60;
    const mins = Math.floor(sessionTime / 60);
    const secs = sessionTime % 60;
    timeLeft.textContent = this.formatTime(mins, secs);
    document.getElementById("timer-label").textContent = "Session";
    this.intervalRef.current = setInterval(this.countdown, 1000);
  };

  handleStartStop = () => {
    this.setState({ running: !this.state.running }, () => {
      if (this.state.running) {
        if (this.state.isSession) {
          this.intervalRef.current = setInterval(this.countdown, 1000);
        } else {
          this.startBreak();
        }
      } else {
        clearInterval(this.intervalRef.current);
      }
    });
  };

  handleClear = () => {
    clearInterval(this.intervalRef.current);
    const audio = document.getElementById("beep");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.setState({
      break: 5,
      session: 25,
      running: false,
      isSession: true,
    });
    document.getElementById("timer-label").textContent = "Session";
    document.getElementById("time-left").textContent = this.formatTime(25, 0);
  };

  clickHandlerIncrement = (display) => {
    this.setState((prevState) => {
      let len = prevState[display];
      let new_len = len + 1;
      if (new_len <= 60) {
        return { [display]: new_len };
      }
    });
  };

  clickHandlerDecrement = (display) => {
    this.setState((prevState) => {
      let len = prevState[display];
      let new_len = len - 1;
      if (new_len >= 1) {
        return { [display]: new_len };
      }
    });
  };

  render() {
    return (
      <div id="clock">
        <h2>25 + 5 Clock</h2>
        <div id="functions">
          <h3 id="break-label">Break Length</h3>
          <div id="break-length">{this.state.break}</div>
          <button
            id="break-increment"
            onClick={() => this.clickHandlerIncrement("break")}
          >
            ↑
          </button>
          <button
            id="break-decrement"
            onClick={() => this.clickHandlerDecrement("break")}
          >
            ↓
          </button>
          <br />
          <h3 id="session-label">Session Length</h3>
          <div id="session-length">{this.state.session}</div>
          <button
            id="session-increment"
            onClick={() => this.clickHandlerIncrement("session")}
          >
            ↑
          </button>
          <button
            id="session-decrement"
            onClick={() => this.clickHandlerDecrement("session")}
          >
            ↓
          </button>
          <h3 id="timer-label">Session</h3>
          <div id="time-left">{this.formatTime(this.state.session, 0)}</div>
          <button id="start_stop" onClick={this.handleStartStop}>
            {this.state.running ? "❚❚" : "➤"}
            <audio id="beep" title="time_up" src="https://audio-previews.elements.envatousercontent.com/files/129648117/preview.mp3"></audio>
          </button>
          <button id="reset" onClick={this.handleClear}>C</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
