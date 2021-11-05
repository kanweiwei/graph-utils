import M from "./matrix";

/**
 * 左上角 x 坐标
 */
type rx = number;
/**
 * 左上角 y 坐标
 */
type ry = number;
/**
 * 宽度
 */
type rw = number;
/**
 * 高度
 */
type rh = number;

function isNumber(n: unknown): n is Number {
  return typeof n === "number" && !isNaN(n);
}

function isUndefined(n: unknown): n is undefined {
  return typeof n === "undefined";
}

function isNull(n: unknown): n is null {
  return n === null;
}

export default class RectF {
  public left!: number;
  public top!: number;
  public right!: number;
  public bottom!: number;

  constructor(
    left?: RectF | number,
    top?: number,
    right?: number,
    bottom?: number
  ) {
    if (typeof left === "undefined") {
      this.left = this.top = this.right = this.bottom = 0;
    }
    if (left instanceof RectF) {
      this.left = left.left;
      this.right = left.right;
      this.top = left.top;
      this.bottom = left.bottom;
    }
    if (
      isNumber(left) &&
      isNumber(top) &&
      isNumber(right) &&
      isNumber(bottom)
    ) {
      this.left = left;
      this.top = top;
      this.right = right;
      this.bottom = bottom;
    }
  }

  public get leftTop(): [number, number] {
    return [this.left, this.top];
  }

  public get rightTop(): [number, number] {
    return [this.right, this.top];
  }

  public get leftBottom(): [number, number] {
    return [this.left, this.bottom];
  }

  public get rightBottom(): [number, number] {
    return [this.right, this.bottom];
  }

  public get width() {
    return this.right - this.left;
  }

  public get height() {
    return this.bottom - this.top;
  }

  public equals(o: any) {
    if (isUndefined(o) || isNull(o)) return false;
    if (this == o) return true;
    if (
      isNumber(o.left) &&
      isNumber(o.top) &&
      isNumber(o.right) &&
      isNumber(o.bottom)
    ) {
      return (
        this.left === o.left &&
        this.top === o.top &&
        this.right === o.right &&
        this.bottom === o.bottom
      );
    }
  }

  // 相交
  public intersects(left: number, top: number, right: number, bottom: number) {
    return (
      this.left < right &&
      left < this.right &&
      this.top < bottom &&
      top < this.bottom
    );
  }

  // 包含
  public contains(x: number, y: number): boolean {
    return (
      this.left < this.right &&
      this.top < this.bottom &&
      x >= this.left &&
      x < this.right &&
      y >= this.top &&
      y < this.bottom
    );
  }

  /**
   * 矩阵变换后得到新的矩形
   * @param matrix
   */
  public mapRect(matrix: M) {
    const leftTop: [number, number] = [this.left, this.top];
    const rightTop: [number, number] = [this.right, this.top];
    const leftBottom: [number, number] = [this.left, this.bottom];
    const rightBottom: [number, number] = [this.left, this.bottom];
    const points = [leftTop, rightTop, leftBottom, rightBottom].map((p) => {
      return matrix.mapPoint(p);
    });
    const xs: number[] = [];
    const ys: number[] = [];
    points.forEach(([x, y]) => {
      xs.push(x);
      ys.push(y);
    });
    const res = new RectF();

    res.left = Math.min.apply(null, xs)!;
    res.right = Math.max.apply(null, xs)!;
    res.top = Math.min.apply(null, ys)!;
    res.bottom = Math.max.apply(null, ys)!;
    return res;
  }

  /**
   * 最大外包盒
   * @mutable 变异
   * @param left
   * @param top
   * @param right
   * @param bottom
   */
  public union(
    left: number | RectF,
    top?: number,
    right?: number,
    bottom?: number
  ) {
    if (left instanceof RectF) {
      this.union(left.left, left.top, left.right, left.bottom);
    } else {
      if (
        isNumber(left) &&
        isNumber(top) &&
        isNumber(right) &&
        isNumber(bottom)
      ) {
        if (left < right && top < bottom) {
          if (this.left < this.right && this.top < this.bottom) {
            if (this.left > left) {
              this.left = left;
            }
            if (this.top > top) {
              this.top = top;
            }
            if (this.right < right) {
              this.right = right;
            }
            if (this.bottom < bottom) {
              this.bottom = bottom;
            }
          } else {
            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
          }
        }
      }
    }
  }

  public toCanvasRect(): [rx, ry, rw, rh] {
    return [
      this.left,
      this.top,
      this.right - this.left,
      this.bottom - this.top,
    ];
  }
}
