interface ActionCallback {
  onSuccess?: (data?: any) => void;
  onFailure?: (e?: any) => void;
  onBeginning?: () => void;
  onFinish?: () => void;
}

interface ActionPayloadStandard<P = any, C = ActionCallback, O = any> {
  params?: P;
  callbacks?: C;
  options?: O;
}

interface ActionPayloadRedux<P = any, C = any> {
  params?: P;
  callback?: C;
}

interface ActionSagas<T = any> {
  type: string;
  payload?: T;
}
interface IAction {
  params?: any;
  callbacks?: ActionCallback;
  type: string;
  options?: object;
}

interface IActionFunc {
  (params?: any, callbacks?: ActionCallback, options?: object): IAction;
}
