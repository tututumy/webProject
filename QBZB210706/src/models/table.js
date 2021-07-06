export default {
  namespace: "table",

  state: {
    nowData: null,
    datalength: 0,
    length: 0,
    height: 0,
    propType: "",
    pushMark: ""
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: "save" });
    },
    *ClickBtn({ payload }, { call, put }) {
      yield put({ type: "SendMsg", payload: payload });
    },
    *tableData({ payload }, { call, put }) {
      yield put({ type: "getMsg", payload: payload.nowData });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    SendMsg(state, { payload }) {
      return {
        ...state,
        nowData: payload.nowData,
        fileId: payload.nowData[0].fileId,
        type: payload.nowData[0].type,
        time: payload.nowData[0].time,
        material_file_source_type_id:
          payload.nowData[0].material_file_source_type_id,
        source: payload.nowData[0].source,
        name: payload.nowData[0].name,
        addr: payload.nowData[0].addr,
        notes: payload.nowData[0].notes,
        propType: payload.propType,
        pushMark: payload.pushMark
      };
    },
    getMsg(state, { payload }) {
      return {
        ...state,
        newData: payload
      };
    }
  }
};
