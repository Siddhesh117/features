import { FORM_LOADER } from "../../constants/ActionTypes";
import type { Dispatch } from "redux";

// Get the token from user input or API response
const token: any = process.env.REACT_APP_TOKEN;

// Add the token to the localStorage
localStorage.setItem("token", token);

export function actionFormLoader(flag: boolean) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: FORM_LOADER,
      payload: flag
    });
  };
}
