const express = require('express');

export const startDummyServer = () => {
  const app = express();

  app.get('/secure', (req: any, res: any) => {
    if (req.headers.cookie.includes('dummy_name=dummy;')) {
      res.sendStatus(200);
    } else {
      res.redirect('http://localhost:4444/login');
    }
  });

  app.get('/redirectme', (_: any, res: any) => res.redirect('http://localhost:4444/secure'));
  app.get('/login', (_: any, res: any) => res.sendStatus(200));
  app.get('/redirectme-infinite-loop', (_: any, res: any) => res.redirect('http://localhost:4444/infinite-loop'));
  app.get('/infinite-loop', (_: any, res: any) => res.redirect('http://localhost:4444/redirectme-infinite-loop'));
  app.get('/infinite-loop-2', (_: any, res: any) => res.redirect('http://localhost:4444/infinite-loop'));

  const server = app.listen(4444, 'localhost');

  return {
    stop: () => server.close(),
  };
};
