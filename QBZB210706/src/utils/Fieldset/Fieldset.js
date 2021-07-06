import React, { PureComponent } from "react";
import { Button } from "antd";
import styles from "./Fieldset.css";

/**
 * admin:chenkr
 * data:2019.03
 *
 */
export default class Fieldset extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { legend, content, color } = this.props;

    const legend1 = legend === null || legend === undefined ? "legend" : legend;
    const content1 =
      content === null || content === undefined
        ? "请定义字符串或ReactNode"
        : content;
    const color1 = color === undefined ? null : "#fff";

    return (
      <div className={styles.field}>
        <div style={{ background: `${color1}` }} className={styles.fieldTitle}>
          {legend1}
        </div>
        <div className={styles.fieldContent}>{content1}</div>
      </div>
    );
  }
}
