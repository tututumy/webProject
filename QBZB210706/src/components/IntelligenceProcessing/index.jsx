import React, { Component } from "react";
export default class IntelligenceProcessing extends Component {
  render() {
    return (
      <div style={{ marginTop: 45 }}>
        {/* 侦察情报管理 */}
        <iframe
          id="ifBox"
          src={"http://" + window.location.host + "/LK-0313038/"}
          frameBorder="0"
          style={{ width: "100%", height: "1080px" }}
        />
      </div>
    );
  }
}
