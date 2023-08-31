import { app, session, Session } from 'electron';
import { ReplaySubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

let listening = false;
let sessions: ReplaySubject<Session> = new ReplaySubject();

export const observeSessions = () => sessions.asObservable();

export const waitDefaultSession = () => observeSessions()
  .pipe(filter(s => s === session.defaultSession))
  .pipe(take(1))
  .toPromise();

export const startSessionsListening = () => {
  if (listening) throw new Error('Cannot call startSessionsListening() several times');
  // @ts-ignore no typing for 'session-created'
  app.on('session-created', (sess: Session) => {
    // usage of `setImmediate` here because `session.defaultSession` cannot be accessed synchronously in the app.on('session-created') callback
    setImmediate(() => sessions.next(sess));
  });
  listening = true;
};

export const stopSessionsListening = () => {
  listening = false;
  sessions.complete();
  sessions = new ReplaySubject();
};
