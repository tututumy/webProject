import {
  selectRightModalColumns,
  loadZCDataDetail,
  loadTargetDataDetail,
  selectPlaneMsg_aysnc,
  selectZBList_aysnc,
  add_PTGZ_radarMsg_aysnc,
  add_PTGZ_commitMsg_aysnc,
  deleteZBList_aysnc,
  selectZBListEditMsg_aysnc,
  ZBStart_aysnc,
  send_selectedRowsPTGZ_radar_aysnc,
  deleteGZPTRadarColumndata_cache_aysnc,
  send_insertPTGZ_commitData_aysnc,
  deleteGZPTCommitColumndata_cache_aysnc,
  save_target_allData_aysnc,
  selectTargetColumnsMsg_aysnc,
  selectPlaneLine_aysnc,
  handleCompareShowMap_axios,
  selectRadarisZB_axios,
  ResultsReleased_axios,
  selectIfHaveRadarOrCommAtADIBI_axios,
  clearCache_axios,
  updateImgData_Special_axios,
  updateVideoData_Special_axios,
  updateHtmlData_Special_axios,
  updateDocData_Special_axios,
  deleteImgColumndata_send_axios,
  deleteVideoColumndata_send_axios,
  deleteHtmlColumndata_send_axios,
  deleteDocColumndata_send_axios,
  selectOnlyLookCommitData_axios,
  selectFreqHoppingPointSet_axios,
  selectIfHaveName_axios,
  selectAllTargetTypeData_axios,
  addTargetTechnicalParam_axios,
  selectTargetTypeRepeatName_axios,
  deleteTargetType_axios,
  selectTargetType_axios,
  selectTargetTypeDetails_axios,
  updateTargetTechnicalParam_axios,
  selectMaterialRepeat_axios
} from "../services/electronicSaync";

export default {
  namespace: "ElectronicTarget",

  state: {
    selectRightModalColumns_data: null, //点击从侦察情报库导入按钮查询的数据
    clearMsg: false, //组件是否挂载了的标识
    ZCAllData: null, //侦察情报库的所有数据

    sn: 0, //从目标库导入或者编辑的
    TargetAllData: null, //目标库中的所有数据
    PlanePoint: null, //目标库中的航迹点信息
    ZBAllData: null, //整编的所有数据
    EditAllData: null, //点击编辑的数据
    selectZBList_data: null, //点击了情报整编按钮，加载整编对象list
    DBFX: false, //对比分析标识
    MomentData: null,
    TargetName: "", //目标库中的目标名称
    airTrackList: null, //目标航迹信息
    AirTrackListMSg_Mark: false, //目标库中的航迹信息被点击了
    AirTrackListMSgPoint: null, //航迹点信息
    AirTrackListMSgLineArr: [], //多条航迹线数组
    AirTrackListMSgLineArr_compare:[],//對比分析的數據

    PTGZ_radarMsg_data: null, //目标库平台挂载雷达信息==页面中的数据
    PTGZ_radarMsg_dialog_data: null, //目标库平台挂载雷达信息==弹出框中的消息
    PTGZ_commitMsg_data: null, ///目标库平台挂载通信装备信息==页面中的数据
    PTGZ_commitMsg_dialog_data: null, //目标库平台挂载通信装备信息==弹出框中的消息

    imgData_Special: null, //电子对抗专题报的图片
    videoData_Special: null, //电子对抗专题报的视频
    htmlData_Special: null, //电子对抗专题报的网页
    docData_Special: null, //电子对抗专题报的文档

    PlaneMark: false,
    selectPlaneLineBtnMark: 0, //点击查看目标航迹态势图按钮
    selectRadarisZB_noZBRadarOrCommu: null, //未整编的雷达或通信名称
    publishRealise_noZBRadarOrCommu: null, //目标库中没有的雷达或通信名称

    selectTargetTypeDetails: null, //点击修改电子目标平台型号查询出来的信息
    ZCtotalCount: ""
  },

  subscriptions: {
    setup({ dispatch, history }) { }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: "save" });
    },
    //点击从侦察情报库导入的模态框中的确定
    *selectRadarColumnsMsg({ payload, callback }, { call, put }) {
      const data = yield call(selectRightModalColumns, payload);
      if (data && data.status === 200) {
        console.log("wwwwwwwwwwwwww", data)
        yield put({ type: "selectRightModalColumns_data", payload: data.data });
        if (callback && typeof callback === "function") {
          callback(data.data);
        }

      }
    },
    *loadZCData({ payload }, { call, put }) {
      const data = yield call(loadZCDataDetail, payload);
      if (data && data.status === 200) {
        yield put({ type: "loadZCDataDetail_data", payload: data.data });
      }
    },
    //点击从目标库导入按钮查询到的数据
    *selectTargetModelMsg({ payload }, { call, put }) {
      const data = yield call(loadTargetDataDetail, payload);
      if (data && data.status === 200) {
        yield put({ type: "loadTargetDataDetail_data", payload: data.data[0] });
      }
    },
    *selectPlaneMsg({ payload }, { call, put }) {
      const data = yield call(selectPlaneMsg_aysnc, payload);
      if (data && data.status === 200) {
        yield put({ type: "selectPlaneMsg_data", payload: data.data });
      }
    },
    //平台挂载雷达信息的“添加”按钮
    *add_PTGZ_radarMsg({ payload, callback }, { call, put }) {
      const data = yield call(add_PTGZ_radarMsg_aysnc, payload);
      if (data && data.status === 200) {
        yield put({ type: "add_PTGZ_radarMsg_data", payload: data.data });
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    //平台挂载通信装备信息的“添加”按钮
    *add_PTGZ_commitMsg({ payload, callback }, { call, put }) {
      const data = yield call(add_PTGZ_commitMsg_aysnc, payload);
      if (data && data.status === 200) {
        yield put({ type: "add_PTGZ_commitMsg_data", payload: data.data });
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    //查询整编列表
    *selectZBList({ payload }, { call, put }) {
      const data = yield call(selectZBList_aysnc, payload);
      if (data && data.status === 200) {
        yield put({ type: "selectZBList_data", payload: data.data });
      }
    },
    //删除整编列表
    *deleteZBList({ payload, callback }, { call, put }) {
      const data = yield call(deleteZBList_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    // 点击整编列表中的编辑按钮
    *selectZBListEditMsg({ payload }, { call, put }) {
      const data = yield call(selectZBListEditMsg_aysnc, payload);
      if (data && data.status === 200) {
        yield put({ type: "selectZBListEditMsg_data", payload: data.data });
      }
    },
    *ZBStart({ payload, callback }, { call, put }) {
      //点击了自动整编
      const data = yield call(ZBStart_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
        yield put({ type: "ZBStart_data", payload: data.data[0] });
      }
    },
    *send_selectedRowsPTGZ_radar({ payload, callback }, { call, put }) {
      const data = yield call(send_selectedRowsPTGZ_radar_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *deleteGZPTRadarColumndata_cache({ payload, callback }, { call, put }) {
      //删除后端缓存中的平台挂载雷达信息
      const data = yield call(deleteGZPTRadarColumndata_cache_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *send_insertPTGZ_commitData({ payload, callback }, { call, put }) {
      //后端缓存添加平台挂载通信装备信息
      const data = yield call(send_insertPTGZ_commitData_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *deleteGZPTCommitColumndata_cache({ payload, callback }, { call, put }) {
      //后端缓存删除平台挂载通信装备信息
      const data = yield call(deleteGZPTCommitColumndata_cache_aysnc, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *save_target_allData({ payload, callback }, { call, put }) {
      //点击保存按钮
      const data = yield call(save_target_allData_aysnc, payload);
      if (data.status === 200)
        if (callback && typeof callback === "function") {
          callback(data);
        }
    },
    *selectTargetColumnsMsg({ payload, callback }, { call, put }) {
      const data = yield call(selectTargetColumnsMsg_aysnc, payload);
      if (data.status === 200)
        if (callback && typeof callback === "function") {
          callback(data);
        }
    },
    *selectPlaneLine({ payload, callback }, { call, put }) {
      //目标库弹出框中查询
      const data = yield call(selectPlaneLine_aysnc, payload);
      if (data && data.status === 200 && data.data) {
        if (callback && typeof callback === "function") {
          yield put({ type: "selectPlaneLine_data", payload: data.data});
          console.log("data====",data)
          // callback(data);
        }
       
      }
    },
    *handleCompareShowMap({ payload, callback }, { call, put }) {
      //点击对比分析的时候弹出地图的弹出框，显示航迹线
      const data = yield call(handleCompareShowMap_axios, payload);
      console.log("data=======",data)
      if (data && data.status === 200) {
        yield put({ type: "selectPlaneLine_compare_data", payload: data.data});
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectRadarisZB({ payload, callback }, { call, put }) {
      //需要在整编库中查询该雷达（通信）辐射源是否已整编（按照辐射源名称查询）：
      const data = yield call(selectRadarisZB_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
        yield put({ type: "selectRadarisZB_data", payload: data.data[0] });
      }
    },
    *ResultsReleased({ payload, callback }, { call, put }) {
      //成果发布
      const data = yield call(ResultsReleased_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectIfHaveRadarOrCommAtADIBI({ payload, callback }, { call, put }) {
      //点击发布之前查询雷达和通信名称是否已存在adiidb库中，若都存在则可以发布，只要有一个不存在，都不允许发布
      const data = yield call(selectIfHaveRadarOrCommAtADIBI_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
        yield put({
          type: "selectIfHaveRadarOrCommAtADIBI_data",
          payload: data.data[0]
        });
      }
    },
    *clearCache({ payload }, { call, put }) {
      //清除缓存
      yield call(clearCache_axios, payload);
    },
    //更新缓存中的图片信息
    *updateImgData_Special({ payload }, { call, put }) {
      const data = yield call(updateImgData_Special_axios, payload);
    },
    *updateVideoData_Special({ payload }, { call, put }) {
      const data = yield call(updateVideoData_Special_axios, payload);
    },
    *updateHtmlData_Special({ payload }, { call, put }) {
      const data = yield call(updateHtmlData_Special_axios, payload);
    },
    *updateDocData_Special({ payload }, { call, put }) {
      const data = yield call(updateDocData_Special_axios, payload);
    },
    *deleteImgColumndata_send({ payload }, { call, put }) {
      const data = yield call(deleteImgColumndata_send_axios, payload);
    },
    *deleteVideoColumndata_send({ payload }, { call, put }) {
      const data = yield call(deleteVideoColumndata_send_axios, payload);
    },
    *deleteHtmlColumndata_send({ payload }, { call, put }) {
      const data = yield call(deleteHtmlColumndata_send_axios, payload);
    },
    *deleteDocColumndata_send({ payload }, { call, put }) {
      const data = yield call(deleteDocColumndata_send_axios, payload);
    },
    *selectOnlyLookCommitData({ payload, callback }, { call, put }) {
      //平台挂载通信信息的查看
      const data = yield call(selectOnlyLookCommitData_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectFreqHoppingPointSet({ payload, callback }, { call, put }) {
      //平台挂载通信信息的查看
      const data = yield call(selectFreqHoppingPointSet_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectIfHaveName({ payload, callback }, { call, put }) {
      //查询输入的电子目标名称是否已经存在
      const data = yield call(selectIfHaveName_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectAllTargetTypeData({ payload, callback }, { call, put }) {
      //查询平台型号
      const data = yield call(selectAllTargetTypeData_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *addTargetTechnicalParam({ payload, callback }, { call, put }) {
      //添加平台型号
      const data = yield call(addTargetTechnicalParam_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectTargetTypeRepeatName({ payload, callback }, { call, put }) {
      //查询平台型号是否重复
      const data = yield call(selectTargetTypeRepeatName_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *deleteTargetType({ payload, callback }, { call, put }) {
      //删除平台型号
      const data = yield call(deleteTargetType_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectTargetType({ payload, callback }, { call, put }) {
      //查询电子目标平台类型
      const data = yield call(selectTargetType_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectTargetTypeDetails({ payload, callback }, { call, put }) {
      //查询电子目标类型对应的战技术参数
      const data = yield call(selectTargetTypeDetails_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectTargetTypeDetails_update({ payload, callback }, { call, put }) {
      //查询电子目标类型对应的战技术参数
      const data = yield call(selectTargetTypeDetails_axios, payload);
      yield put({ type: "selectTargetTypeDetails_data", payload: data.data });
    },
    *updateTargetTechnicalParam({ payload, callback }, { call, put }) {
      const data = yield call(updateTargetTechnicalParam_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    },
    *selectMaterialRepeat({ payload, callback }, { call, put }) {
      //查询素材名称是否重复
      const data = yield call(selectMaterialRepeat_axios, payload);
      if (data && data.status === 200) {
        if (callback && typeof callback === "function") {
          callback(data);
        }
      }
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    //主组件卸载的时候清除所有数据源
    clearAllMsg(state, { payload }) {
      return {
        ...state,
        ZCAllData: null,
        TargetAllData: null,
        MomentData: null,
        EditAllData: null,

        DBFX: false,
        PTGZ_radarMsg_dialog_data: null,
        PTGZ_radarMsg_data: null,
        PTGZ_commitMsg_data: null,
        PTGZ_commitMsg_dialog_data: null,
        imgData_Special: null,
        videoData_Special: null,
        htmlData_Special: null,
        docData_Special: null,
        airTrackList: null,
        AirTrackListMSg_Mark: false,
        sn: 0,
        selectRadarisZB_noZBRadarOrCommu: null,
        publishRealise_noZBRadarOrCommu: null,
        AirTrackListMSgPoint: null
      };
    },
    //查询侦察情报库的数据的时候关闭侦察和目标中工作模式点击列的状态
    selectRightModalColumns_data(state, { payload }) {
      return {
        ...state,
        selectRightModalColumns_data: payload,
        ZCtotalCount: payload[1],
        DBFX: false
      };
    },
    loadZCDataDetail_data(state, { payload }) {
      return {
        ...state,
        ZCAllData: payload
      };
    },
    loadTargetDataDetail_data(state, { payload }) {
      return {
        ...state,
        TargetAllData: payload,
        PTGZ_radarMsg_data: payload.radarBasicMesElectObjList,
        PTGZ_commitMsg_data: payload.commuBasicMesElectObjList,
        airTrackList: payload.airTrackList,
        imgData_Special: payload.picList,
        videoData_Special: payload.videoList,
        htmlData_Special: payload.htmlList,
        docData_Special: payload.docList,
        MomentData: null,
        AirTrackListMSg_Mark: false,
        AirTrackListMSgPoint: null,
        sn: 1,
        selectRadarisZB_noZBRadarOrCommu: null,
        publishRealise_noZBRadarOrCommu: null
      };
    },
    selectPlaneMsg_data(state, { payload }) {
      return {
        ...state,
        PlanePoint: payload
      };
    },
    //点击了整编
    ZBStart_data(state, { payload }) {
      return {
        ...state,
        TargetAllData: payload,
        PTGZ_radarMsg_data: payload.radarBasicMesElectObjList,
        PTGZ_commitMsg_data: payload.commuBasicMesElectObjList,
        airTrackList: payload.airTrackList,
        imgData_Special: payload.picList,
        videoData_Special: payload.videoList,
        htmlData_Special: payload.htmlList,
        docData_Special: payload.docList,
        AirTrackListMSg_Mark: false,
        selectRadarisZB_noZBRadarOrCommu: null,
        publishRealise_noZBRadarOrCommu: null
      };
    },
    //点击了情报整编按钮，加载整编对象list
    selectZBList_data(state, { payload }) {
      return {
        ...state,
        selectZBList_data: payload[0],
        DBFX: false
      };
    },
    //点击了对比分析
    handleCompare(state, { payload }) {
      return {
        ...state,
        DBFX: payload.DBFX,
        MomentData: payload.values
      };
    },
    selectAirTrackListMSgPoint(state, { payload }) {
      return {
        ...state,
        AirTrackListMSgPoint: payload.momentAirTrackListMSg.airTrackPtList, //航迹点信息
        AirTrackListMSg_Mark: true //工作模式中点击行状态true
      };
    },

    add_PTGZ_radarMsg_data(state, { payload }) {
      return {
        ...state,
        PTGZ_radarMsg_dialog_data: payload[0]
      };
    },
    add_PTGZ_commitMsg_data(state, { payload }) {
      return {
        ...state,
        PTGZ_commitMsg_dialog_data: payload[0]
      };
    },
    insertPTGZ_radarData(state, { payload }) {
      return {
        ...state,
        PTGZ_radarMsg_data: payload.dataSource
      };
    },
    deleteGZPTRadarColumndata(state, { payload }) {
      return {
        ...state,
        PTGZ_radarMsg_data: payload
      };
    },
    insertPTGZ_commitData(state, { payload }) {
      return {
        ...state,
        PTGZ_commitMsg_data: payload.dataSource
      };
    },
    deleteGZPTCommitColumndata(state, { payload }) {
      return {
        ...state,
        PTGZ_commitMsg_data: payload
      };
    },
    clearRelateMsg(state, { payload }) {
      return {
        ...state,
        PTGZ_commitMsg_data: payload
      };
    },

    // 相关资料中的选用素材中点击确定
    insertImgData_Special(state, { payload }) {
      return {
        ...state,
        imgData_Special: payload.dataSource
      };
    },
    insertVideoData_Special(state, { payload }) {
      return {
        ...state,
        videoData_Special: payload.dataSource
      };
    },
    insertHtmlData_Special(state, { payload }) {
      return {
        ...state,
        htmlData_Special: payload.dataSource
      };
    },
    insertDocData_Special(state, { payload }) {
      return {
        ...state,
        docData_Special: payload.dataSource
      };
    },
    deleteImgColumndata(state, { payload }) {
      return {
        ...state,
        imgData_Special: payload
      };
    },
    deleteVideoColumndata(state, { payload }) {
      return {
        ...state,
        videoData_Special: payload
      };
    },
    deleteHtmlColumndata(state, { payload }) {
      return {
        ...state,
        htmlData_Special: payload
      };
    },
    deleteDocColumndata(state, { payload }) {
      return {
        ...state,
        docData_Special: payload
      };
    },
    deleteElectronicTargetColumn_Special(state, { payload }) {
      return {
        ...state,
        ElectronicTargetColumn_Special: payload
      };
    },
    //保存表单的数据
    saveSpecialormMsg(state, { payload }) {
      return {
        ...state,
        TargetAllData: payload
      };
    },
    //点击整编列表中的编辑按钮
    selectZBListEditMsg_data(state, { payload }) {
      return {
        ...state,
        TargetAllData: payload,
        MomentData: null,
        // TargetAllData:null,
        PTGZ_radarMsg_data: payload[3],
        PTGZ_commitMsg_data: payload[4],
        imgData_Special: payload[5],
        videoData_Special: payload[6],
        htmlData_Special: payload[7],
        docData_Special: payload[8]
      };
    },
    //點擊查看目標航跡態勢圖
    selectPlaneLine_data(state, { payload }) {
      console.log("payload=======11111=====",payload)
      console.log("payload============",[...payload])
      return {
        ...state,
        AirTrackListMSgLineArr: payload
      };
    },
    //點擊對比分析
    selectPlaneLine_compare_data(state, { payload }) {
      console.log("payload=======11111=====",payload)
      console.log("payload============",[...payload])
      return {
        ...state,
        AirTrackListMSgLineArr_compare: payload
      };
    },
    changeMark(state, { payload }) {
      return {
        ...state,
        PlaneMark: true
      };
    },
    selectPlaneLineBtn(state, { payload }) {
      //点击查看目标航迹态势图按钮
      return {
        ...state,
        selectPlaneLineBtnMark: payload
      };
    },
    selectRadarisZB_data(state, { payload }) {
      //点击自动整编返回回来没有整编的挂载雷达或者通信
      return {
        ...state,
        selectRadarisZB_noZBRadarOrCommu: payload
      };
    },
    selectIfHaveRadarOrCommAtADIBI_data(state, { payload }) {
      console.log("payload====aaa====", payload)
      //成果发布之前的查询结果
      return {
        ...state,
        publishRealise_noZBRadarOrCommu: payload
      };
    },
    selectTargetTypeDetails_data(state, { payload }) {
      return {
        ...state,
        selectTargetTypeDetails: payload
      };
    }
  }
};
