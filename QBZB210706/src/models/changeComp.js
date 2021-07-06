export default {
  namespace: "changeComp",

  state: {
    mark: "first",
    allMsg: "",
    comparativeAnalysisMark: false
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
    //点击目标库中的关闭按钮，加载second
    *ClickCloseL({ payload }, { call, put }) {
      yield put({ type: "closeL", payload: payload });
    },
    //点击侦察情报库中的关闭按钮，加载first
    *ClickCloseR({ payload }, { call, put }) {
      yield put({ type: "closeR", payload: payload });
    },
    //打开third
    *openZhonghe({ payload }, { call, put }) {
      yield put({ type: "openZH", payload: payload });
    },
    *saveAllMsg({ payload }, { call, put }) {
      yield put({ type: "saveAllMsg_data", payload: payload });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    closeL(state, { payload }) {
      return {
        ...state,
        mark: payload.mark,
        comparativeAnalysisMark: false
      };
    },
    closeR(state, { payload }) {
      return {
        ...state,
        mark: payload.mark,
        comparativeAnalysisMark: false
      };
    },
    openZH(state, { payload }) {
      return {
        ...state,
        mark: payload.mark,
        comparativeAnalysisMark: false
      };
    },
    saveAllMsg_data(state, { payload }) {
      return {
        ...state,
        allMsg: payload,
        comparativeAnalysisMark: false
      };
    }
  }
};
