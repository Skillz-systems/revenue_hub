import { types } from "mobx-state-tree";

const RootStore = types
  .model({
    refreshDemandNotice: types.boolean,
  })
  .actions((self) => ({
    updateDemandList(status: boolean) {
      self.refreshDemandNotice = status;
    },
  }));

export const rootStore = RootStore.create({
  refreshDemandNotice: false,
});
