export default function reducer (state, action) {
  switch (action.type) {
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        user: action.user,
        isLogin: true,
        isAppReady: true,
      }
    case 'FETCH_USER_FAIL':
      return {
        ...state,
        isLogin: false,
        isAppReady: true,
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.user,
        isLogin: true,
      }
    case 'SIGN_OUT':
      return {
        ...state,
        user: {},
        isLogin: false,
      }
    case 'FETCH_COURSES_START':
      return {
        ...state,
        courses: {
          ...state.courses,
          loading: true,
        },
      }
    case 'FETCH_COURSES_SUCCESS':
      return {
        ...state,
        courses: {
          loading: false,
          data: action.courses,
        },
      }
    default:
      return new Error()
  }
}
