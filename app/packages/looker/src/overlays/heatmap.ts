/**
 * Copyright 2017-2021, Voxel51, Inc.
 */

import { get32BitColor, getRGBA, getRGBAColor } from "../color";
import { ARRAY_TYPES, NumpyResult, TypedArray } from "../numpy";
import { BaseState, Coordinates, RGB } from "../state";
import { BaseLabel, CONTAINS, Overlay, PointInfo, SelectData } from "./base";
import { sizeBytes, strokeCanvasRect, t } from "./util";

interface HeatMap {
  data: NumpyResult;
  image: ArrayBuffer;
}

interface HeatmapLabel extends BaseLabel {
  map?: HeatMap;
  range?: [number, number];
}

interface HeatmapInfo extends BaseLabel {
  map?: {
    shape: [number, number];
  };
  range?: [number, number];
}

export default class HeatmapOverlay<State extends BaseState>
  implements Overlay<State, HeatmapInfo> {
  readonly field: string;
  private readonly label: HeatmapLabel;
  private targets?: TypedArray;
  private readonly range: [number, number];
  private cached?: RGB[] | ((key: string | number) => string);
  private canvas: HTMLCanvasElement;
  private imageData: ImageData;

  constructor(field: string, label: HeatmapLabel) {
    this.field = field;
    this.label = label;
    if (this.label.map) {
      this.targets = new ARRAY_TYPES[this.label.map.data.arrayType](
        this.label.map.data.buffer
      );
      const [height, width] = this.label.map.data.shape;
      this.canvas = document.createElement("canvas");
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  containsPoint(state: Readonly<State>): CONTAINS {
    if (this.getTarget(state)) {
      return CONTAINS.CONTENT;
    }
    return CONTAINS.NONE;
  }

  draw(ctx: CanvasRenderingContext2D, state: Readonly<State>): void {
    const imageMask = new Uint32Array(this.imageData.data.buffer);
    const getColor = this.getColor(cache);
    for (let i = 0; i < this.targets.length; i++) {
      imageMask[i] = getColor(this.targets[i]);
    }

    const maskCtx = this.canvas.getContext("2d");
    maskCtx.imageSmoothingEnabled = false;
    maskCtx.clearRect(
      0,
      0,
      this.label.map.data.shape[1],
      this.label.map.data.shape[0]
    );
    maskCtx.putImageData(this.imageData, 0, 0);

    const [tlx, tly] = t(state, 0, 0);
    const [brx, bry] = t(state, 1, 1);
    ctx.drawImage(this.canvas, tlx, tly, brx - tlx, bry - tly);

    if (this.isSelected(state)) {
      strokeCanvasRect(ctx, state, state.options.colorMap(this.field));
    }
  }

  getMouseDistance(state: Readonly<State>): number {
    if (this.containsPoint(state)) {
      return 0;
    }
    return Infinity;
  }

  getPointInfo(state: Readonly<State>): PointInfo<HeatmapInfo> {
    const target = this.getTarget(state);
    return {
      color: getRGBAColor(getRGBA(this.getColor(this.cached)(target))),
      label: {
        ...this.label,
        map: {
          shape: this.label.map ? this.label.map.data.shape : null,
        },
      },
      field: this.field,
      target,
      type: "Heatmap",
    };
  }

  getSelectData(): SelectData {
    return {
      id: this.label.id,
      field: this.field,
    };
  }

  isSelected(state: Readonly<State>): boolean {
    return state.options.selectedLabels.includes(this.label.id);
  }

  isShown(state: Readonly<State>): boolean {
    return state.options.activePaths.includes(this.field);
  }

  getPoints(): Coordinates[] {
    return getHeatmapPoints([]);
  }

  getSizeBytes(): number {
    return sizeBytes(this.label);
  }

  needsLabelUpdate(state) {
    const cache = !state.options.colorByLabel
      ? state.options.colorMap
      : state.options.colorscale || state.options.colorMap;
    return this.targets && this.cached !== cache;
  }

  private getIndex(state: Readonly<State>): number {
    const [sx, sy] = this.getMapCoordinates(state);
    if (sx < 0 || sy < 0) {
      return -1;
    }
    return this.label.map.data.shape[1] * sy + sx;
  }

  private getMapCoordinates({
    pixelCoordinates: [x, y],
    config: {
      dimensions: [mw, mh],
    },
  }: Readonly<State>): Coordinates {
    const [h, w] = this.label.map.data.shape;
    const sx = Math.floor(x * (w / mw));
    const sy = Math.floor(y * (h / mh));
    return [sx, sy];
  }

  private getColor(
    picker: RGB[] | ((key: string | number) => string)
  ): (value: number) => number {
    const [start, stop] = this.range;

    if (Array.isArray(picker)) {
      return (value) => {
        if (value === 0) {
          return 0;
        }

        const index = Math.round(
          (Math.max(value - start, 0) / (stop - start)) * (picker.length - 1)
        );

        return get32BitColor(picker[index]);
      };
    }

    const color = picker(this.field);
    const max = Math.max(Math.abs(start), Math.abs(stop));
    return (value) => {
      if (value === 0) {
        return 0;
      }

      value = Math.min(max, Math.abs(value)) / max;

      return get32BitColor(color, value / max);
    };
  }

  private getTarget(state: Readonly<State>): number {
    const index = this.getIndex(state);

    if (index < 0) {
      return null;
    }
    return this.targets[index];
  }
}

export const getHeatmapPoints = (labels: HeatmapLabel[]): Coordinates[] => {
  return [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ];
};
