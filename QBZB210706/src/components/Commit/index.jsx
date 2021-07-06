import React, { Component } from "react";
export default class Commit extends Component {
  // componentDidMount(){
  //   document.getElementById("ifBox").src="http://www.baidu.com";
  // }
  render() {
    return (
      <div style={{ marginTop: 45 }}>
        {/* 通信 */}
        <iframe
          id="ifBox"
          src={"http://" + window.location.host + "/TK-INFO/"}
          frameBorder="0"
          style={{ width: "100%", height: "1080px" }}
        />
        {/* <iframe id="ifBox"  frameBorder="0" style={{ width: '100%', height: '1080px' }}></iframe> */}
      </div>
    );
  }
}
