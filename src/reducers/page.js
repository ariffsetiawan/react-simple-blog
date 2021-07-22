export default (state={comments: []}, action) => {
  switch(action.type) {
    case 'SUBMIT_COMMENT':
      return {
        ...state,
        comments: ([action.data.comment]).concat(state.comments),
      };
    default:
      return state;
  }
};