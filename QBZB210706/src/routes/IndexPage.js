import React from "react";
import { connect } from "dva";
// import MennuRouter from './MennuRouter';
import MennuRouter from "./MennuRouter";

function IndexPage() {
  return (
    <>
      <MennuRouter />
    </>
  );
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
