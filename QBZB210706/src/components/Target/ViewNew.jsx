import React, { Component, Fragment } from "react";
import styles from "./ViewNew.css";
import styleless from "./test.less";
import { Link } from "react-router-dom";
import { Input, Select, Button,Tooltip } from "antd";
import { connect } from "dva";
import language from "../language/language";

let component = "";
@connect(({ table, language }) => ({ table, language }))
export default class ViewNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelMark: "basicMsg"
    };
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    this.setState({ modelMark: nextprops.table.propType });
    // if(nextprops.table.propType==="basicMsg"){
    //     component=<BasicMsg/> ;
    // }else if(nextprops.table.propType==="technicalParam"){
    //     component=<TechnicalParam/>;
    // }
  }

  render() {
    let { table } = this.props;
    return (
      <Fragment>
        <div className={styles.ContentInfo}>
          <div
            style={{
              padding: "5px 5px 5px 20px",
              width: "1560px",
              height: "40px",
              float: "left",
              marBottom: 40
            }}
          >
            <Link to="/radarinformation">
              <Button type="primary">
                {language[`ReturnTheMaterialList_${this.props.language.getlanguages}`]}
              </Button>
            </Link>
          </div>
          <div className={styles.Fodderinfo}>
            {
              language[`MaterialFileInformation_${this.props.language.getlanguages}`]
            }
          </div>
          {/* <div className={styles.foddersubhead}>{language[`basicInformation_${this.props.language.getlanguages}`]}</div> */}
          <table style={{ background: "#ffff" }}>
            <tr className={styles.tableRow}>
              <td className={styles.tableCol}>
                {language[`materialNumber_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>{table.fileId}</td>
              <td className={styles.tableCol}>
                {language[`MaterialType_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>{table.type}</td>
              <td className={styles.tableCol}>
                {language[`MaterialGenerationTime_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>{table.time}</td>
            </tr>
            <tr>
              <td className={styles.tableCol}>
                {language[`materialSourceIdentification_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>
                {table.material_file_source_type_id}
              </td>
              <td className={styles.tableCol}>
                {language[`materialOriginalNumber_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>data.type</td>
              <td className={styles.tableCol}>
                {language[`MaterialSource_${this.props.language.getlanguages}`]}
              </td>
              <td className={styles.tableColcontent}>{table.source}</td>
            </tr>
            <tr>
              <td className={styles.tableCol}>
                {language[`materialName_${this.props.language.getlanguages}`]}
              </td>
              <td colspan="5" className={styles.tableCrossCol}>
                {table.name}
              </td>
            </tr>
            <tr>
              <td className={styles.tableCol}>
                {language[`MaterialStorageAddress_${this.props.language.getlanguages}`]}
              </td>
              <td colspan="5" className={styles.tableCrossCol}>
                {table.addr}
              </td>
            </tr>
            <tr>
              <td className={styles.tableColSketch}>
                {language[`BriefDescriptionOfMaterial_${this.props.language.getlanguages}`]}
              </td>
              <td colspan="5" className={styles.CrossRow}>
                {table.notes}
              </td>
            </tr>
          </table>
        </div>
        <div>
          {/* 为了假数据 */}
          {/* {component} */}
          {/* <BasicMsg/>  */}
          {/* <TechnicalParam/> */}
        </div>
      </Fragment>
    );
  }
}
