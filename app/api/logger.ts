export const logger = {
  notify: (e: Error, meta?: any) => {
    console.error(e);
    if (meta) console.info(meta);
  },
};
