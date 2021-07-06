export default {
  namespace: "changeC",

  state: {
    mark: "first"
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
    *ClickCloseL({ payload }, { call, put }) {
      yield put({ type: "closeL", payload: payload });
    },
    *ClickCloseR({ payload }, { call, put }) {
      yield put({ type: "closeR", payload: payload });
    },
    *openZhonghe({ payload }, { call, put }) {
      yield put({ type: "openZH", payload: payload });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    closeL(state, { payload }) {
      return {
        ...state,
        mark: payload.mark
      };
    },
    closeR(state, { payload }) {
      return {
        ...state,
        mark: payload.mark
      };
    },
    openZH(state, { payload }) {
      return {
        ...state,
        mark: payload.mark
      };
    }
  }
};
