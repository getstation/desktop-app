import {
  ApiResponse,
  setApiResponse,
  setApplicationCreated,
  SUBMIT_APP_REQUEST,
  SubmitAppRequestAction,
  Visibility,
} from '@src/app-request/duck';
import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';

function* handleAppRequest(request: SubmitAppRequestAction): SagaIterator {
  if (request.visibility === Visibility.Public) {
    yield put(setApiResponse(ApiResponse.Done));
  } else {
    const { type, ...appRequestData } = request;

    const applicationRecipe = {
      name: appRequestData.name,
      themeColor: appRequestData.themeColor,
      bxIconURL: appRequestData.logoURL,
      startURL: appRequestData.signinURL,
      scope: appRequestData.scope,
    };

    try {
      const { body } = yield call(window.bx.applications.requestPrivate, applicationRecipe);
      yield put(setApiResponse(ApiResponse.Done));
      yield put(setApplicationCreated({ id: body.id, bxAppManifestURL: body.bxAppManifestURL }));
    } catch (e) {
      yield put(setApiResponse(ApiResponse.Error));
    }
  }
}

export default function* main() {
  yield all([
    takeLatest(SUBMIT_APP_REQUEST, handleAppRequest),
  ]);
}
