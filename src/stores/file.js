import { defineStore } from "pinia";

export const useFileStore = defineStore("file", {
  state: () => ({
    partList: [],
  }),
  actions:{
    updatePartList(newPartList) {
      this.partList = newPartList;
    },
  }
});
    