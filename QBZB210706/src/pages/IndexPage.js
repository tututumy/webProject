/*
 * @Author: PAY
 * Date: 2020-03-06 10:47:32
 * LastEditTime: 2020-03-12 11:23:19
 * LastEditors: Please set LastEditors
 * Description:    入口文件
 * FilePath: \spm\src\pages\IndexPage.js
 */
import React from 'react';
import { connect } from 'dva';
// import { Provider } from 'react-redux';
import Main from "../routes/Main";


function IndexPage() {
  return (
    <Main />
  );
}

IndexPage.propTypes = {

};

export default connect()(IndexPage);
