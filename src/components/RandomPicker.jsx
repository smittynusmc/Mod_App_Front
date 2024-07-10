import React from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";

class RandomPicker extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      isRunning: false,
      currentChoice: "",
    };

    this.interval = null;
    this.intervalDuration = 25;
    this.duration = 1000;

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.pickChoice = this.pickChoice.bind(this);
    this.setChoice = this.setChoice.bind(this);
  }

  start() {
    clearInterval(this.interval);
    this.interval = setInterval(this.setChoice, this.intervalDuration);
    this.setState({ isRunning: true });
    setTimeout(() => {
      if (this.state.isRunning) {
        this.stop();
      }
    }, this.duration);
  }

  stop() {
    clearInterval(this.interval);
    const { currentChoice } = this.state;
    this.setState({ isRunning: false });
    // Call the parent component's callback with the selected winner
    if (this.props.onWinnerSelected && currentChoice) {
      this.props.onWinnerSelected(currentChoice);
    }
  }

  reset() {
    clearInterval(this.interval);
    this.setState({ isRunning: false, currentChoice: "" });
  }

  pickChoice() {
    const { items } = this.props;
    if (items.length === 0) {
      return "";
    }
    const choice = items[Math.floor(Math.random() * items.length)];
    return choice;
  }

  setChoice() {
    this.setState({ currentChoice: this.pickChoice() });
  }

  render() {
    const { isRunning, currentChoice } = this.state;

    return (
      <Box className="RandomPicker" sx={{ textAlign: "center", mt: 4 }}>
        <RandomPickerChoice choice={currentChoice} />
        <RandomPickerControls
          isRunning={isRunning}
          hasChoice={currentChoice.trim().length > 0}
          start={this.start}
          stop={this.stop}
          reset={this.reset}
        />
      </Box>
    );
  }
}

RandomPicker.propTypes = {
  items: PropTypes.array.isRequired,
  onWinnerSelected: PropTypes.func, // Add the prop type for the callback
};

class RandomPickerChoice extends React.PureComponent {
  render() {
    const { choice } = this.props;
    const content = choice ? choice.trim() : "Click start to pick a winner!";

    return (
      <Typography variant="h4" className="RandomPicker__choice" gutterBottom>
        {content}
      </Typography>
    );
  }
}

RandomPickerChoice.propTypes = {
  choice: PropTypes.string,
};

class RandomPickerControls extends React.PureComponent {
  render() {
    const { isRunning, hasChoice, start, stop, reset } = this.props;

    return (
      <Box
        className="RandomPicker__controls"
        sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}
      >
        <Button
          variant="contained"
          color={isRunning ? "secondary" : "primary"}
          onClick={isRunning ? stop : start}
        >
          {isRunning ? "Stop" : "Start"}
        </Button>
        <Button
          variant="outlined"
          onClick={reset}
          disabled={isRunning || !hasChoice}
        >
          Reset
        </Button>
      </Box>
    );
  }
}

RandomPickerControls.propTypes = {
  isRunning: PropTypes.bool,
  hasChoice: PropTypes.bool,
  start: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default RandomPicker;
