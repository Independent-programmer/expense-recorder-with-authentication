import React from "react";
import YouTube from "react-youtube";

class Example extends React.Component {
  render() {
    const opts = {
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };

    return (
      <YouTube videoId="w7ejDZ8SWv8" opts={opts} onReady={this._onReady} />
    );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.playVideo();
  }
}

export default Example;
