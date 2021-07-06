import React, { Component } from "react";
// ES6
import Draggable from "react-draggable"; // The default
import { DraggableCore } from "react-draggable"; // <DraggableCore>

export default class Index1 extends Component {
  render() {
    return (
      <Draggable
        axis="x"
        handle=".handle"
        defaultPosition={{ x: 0, y: 0 }}
        position={null}
        grid={[25, 25]}
        scale={1}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
      >
        <div>
          <div className="handle">Drag from here</div>
          <div>This readme is really dragging on...</div>
        </div>
      </Draggable>
    );
  }
}
