/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    const removeOrphanQuery = `
      DELETE FROM subwindow
      WHERE "tabId" NOT IN (
        SELECT tabs.tabId
        FROM tab AS tabs
      )
    `;
    return query.sequelize.query(removeOrphanQuery, { raw: true });
  },

  // No need to rollback deletion of orphan data
  down(query, DataTypes) {
    return null;
  }
};
