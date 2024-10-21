import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import PlaybackStepComponent from '../components/record-modal/playback-step.jsx';
import AudioBufferPlayer from '../lib/audio/audio-buffer-player.js';

class PlaybackStep extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ['handlePlay', 'handleStopPlaying']);
    this.audioBufferPlayer = null;
  }

  componentDidMount() {
    this.audioBufferPlayer = new AudioBufferPlayer(this.props.samples, this.props.sampleRate);
  }

  componentWillUnmount() {
    this.audioBufferPlayer.stop();
  }

  handlePlay() {
    this.audioBufferPlayer.play(
      this.props.trimStart,
      this.props.trimEnd,
      this.props.onSetPlayhead,
      this.props.onStopPlaying
    );
    this.props.onPlay();
  }

  handleStopPlaying() {
    this.audioBufferPlayer.stop();
    this.props.onStopPlaying();
  }

  render() {
    const {
      sampleRate,
      samples,
      onPlay,
      onStopPlaying,
      onSetPlayhead,
      ...componentProps
    } = this.props;
    return (
      <PlaybackStepComponent
        onPlay={this.handlePlay}
        onStopPlaying={this.handleStopPlaying}
        {...componentProps}
      />
    );
  }
}

PlaybackStep.propTypes = {
  sampleRate: PropTypes.number.isRequired,
  samples: PropTypes.instanceOf(Float32Array).isRequired,
  onPlay: PropTypes.func.isRequired,
  onStopPlaying: PropTypes.func.isRequired,
  onSetPlayhead: PropTypes.func.isRequired,
  // other prop types from PlaybackStepComponent
};

export default PlaybackStep;
