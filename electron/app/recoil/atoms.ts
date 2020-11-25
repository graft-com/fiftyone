import { atom, atomFamily } from "recoil";

import { SelectedObjectMap } from "../utils/selection";

export const port = atom({
  key: "port",
  default: parseInt(process.env.FIFTYONE_SERVER_PORT) || 5151,
});

export const connected = atom({
  key: "connected",
  default: false,
});

export const refresh = atom({
  key: "refresh",
  default: false,
});

export const activePlot = atom({
  key: "activePlot",
  default: "labels",
});

export const datasetStats = atom({
  key: "datasetStats",
  default: [],
});

export const datasetStatsLoading = atom({
  key: "datasetStatsLoading",
  default: true,
});

export const extendedDatasetStats = atom({
  key: "extendedDatasetStats",
  default: [],
});

export const extendedDatasetStatsLoading = atom({
  key: "extendedDatasetStatsLoading",
  default: true,
});

export const loading = atom({
  key: "loading",
  default: false,
});

export const colorMap = atom({
  key: "colorMap",
  default: {},
});

export const stateDescription = atom({
  key: "stateDescription",
  default: {},
});

export const selectedSamples = atom({
  key: "selectedSamples",
  default: new Set(),
});

export const selectedObjects = atom<SelectedObjectMap>({
  key: "selectedObjects",
  default: {},
});

export const hiddenObjects = atom<SelectedObjectMap>({
  key: "hiddenObjects",
  default: {},
});

export const stageInfo = atom({
  key: "stageInfo",
  default: undefined,
});

export const sidebarVisible = atom({
  key: "sidebarVisible",
  default: true,
});

export const currentSamples = atom({
  key: "currentSamples",
  default: [],
});

export const modalFilterIncludeLabels = atomFamily({
  key: "modalFilterIncludeLabels",
  default: [],
});

export const modalFilterLabelConfidenceRange = atomFamily({
  key: "modalFilterLabelConfidenceRange",
  default: [null, null],
});

export const modalFilterLabelIncludeNoConfidence = atomFamily({
  key: "modalFilterLabelIncludeNoConfidence",
  default: true,
});

export const activeLabels = atomFamily({
  key: "activeLabels",
  default: {},
});

export const modalActiveLabels = atomFamily({
  key: "modalActiveLabels",
  default: {},
});

export const activeOther = atomFamily({
  key: "activeOther",
  default: {},
});

export const modalActiveOther = atomFamily({
  key: "modalActiveOther",
  default: {},
});

export const activeTags = atom({
  key: "activeTags",
  default: {},
});

export const modalActiveTags = atom({
  key: "modalActiveTags",
  default: {},
});

export const sampleVideoLabels = atomFamily({
  key: "sampleVideoLabels",
  default: null,
});

export const sampleFrameData = atomFamily({
  key: "sampleFrameData",
  default: null,
});

export const sampleFrameRate = atomFamily({
  key: "sampleFrameRate",
  default: null,
});

export const sampleVideoDataRequested = atomFamily({
  key: "sampleVideoDataRequested",
  default: null,
});

export const viewCounter = atom({
  key: "viewCounter",
  default: 0,
});

export const colorByLabel = atom({
  key: "colorByLabel",
  default: false,
});

export const modalColorByLabel = atom({
  key: "modalColorByLabel",
  default: false,
});
