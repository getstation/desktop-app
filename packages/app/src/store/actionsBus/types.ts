import { Action } from 'redux';
import { BehaviorSubject, Observable } from 'rxjs';

export type ActionsEmitter = BehaviorSubject<Action<string>>;
export type ActionsBus = Observable<Action<string>>;
