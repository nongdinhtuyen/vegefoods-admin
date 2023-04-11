import { createAction } from '@reduxjs/toolkit';

export const INIT = 'INIT';
export const INIT_SUCCEED = 'INIT_SUCCEED';

export default {
  actionInit: createAction<ActionPayloadStandard>(INIT),
  actionInitSucceed: createAction<ActionPayloadStandard>(INIT_SUCCEED),
};
