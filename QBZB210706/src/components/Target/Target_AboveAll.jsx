import React, { Component } from "react";
import style from "./Edit.css";
import Target_TargetModel from "./Target_TargetModel";
import Target_ScoutModel from "./Target_ScoutModel";
import { connect } from "dva";
import language from "../language/language";

@connect(({ language }) => ({ language }))
export default class Target_AboveAll extends Component {
  render() {
    return (
      <div className={style.clearFloat}>
        {/* 左边的从目标库导入的内容 */}
        <div style={{ float: "left" }}>
          <div className={style.scroll}>
            <Target_TargetModel name="aaa" />
          </div>
        </div>
        {/* 右边的从侦察情报库导入的内容 */}
        <div style={{ float: "left" }}>
          <Target_ScoutModel name="aaa" />
        </div>
      </div>
    );
  }
}
