type Vec = [number, number];

/**
 * @description 矩阵
 * 3x3
 * [
 *  scaleX, skewX, transX
 *  skewY,  scaleY, transY
 *  perSp0, perSp1, perSp2
 * ]
 *
 * web DOMMatrix 4x4 矩阵
 * [
 *  scaleX, skewX,  1, transX
 *  skewY,  scaleY, 1, transY
 *  1,         1,   1, 1
 *  perSp0, perSp1  1, perSp2
 * ]
 */
export default class Matrix {
  /**
   * 单位矩阵
   * @returns
   */
  static identity() {
    return new Matrix();
  }

  public value: number[];

  constructor() {
    this.value = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }

  public get scaleX() {
    return this.value[0];
  }

  public get skewX() {
    return this.value[3];
  }

  public get transX() {
    return this.value[6];
  }

  public get skewY() {
    return this.value[1];
  }

  public get scaleY() {
    return this.value[4];
  }

  public get transY() {
    return this.value[7];
  }

  public get perSp0() {
    return this.value[2];
  }

  public get perSp1() {
    return this.value[5];
  }

  public get perSp2() {
    return this.value[8];
  }

  scale(v: Vec) {
    const m = new Matrix();
    m.setScale(...v);
    return this.mul(m);
  }

  setScale(scaleX: number, scaleY: number) {
    this.value[0] = scaleX;
    this.value[4] = scaleY;
    return this;
  }

  rotate(rad: number) {
    const m = new Matrix();
    m.setRotate(rad);
    return this.mul(m);
  }

  setRotate(rad: number) {
    this.value[0] = Math.cos(rad);
    this.value[1] = Math.sin(rad);

    this.value[3] = -Math.sin(rad);
    this.value[4] = Math.cos(rad);
    return this;
  }

  mul(m: Matrix) {
    const res = new Matrix();
    res.value[0] =
      this.scaleX * m.scaleX + this.skewX * m.skewY + this.transX * m.perSp0;
    res.value[3] =
      this.scaleX * m.skewX + this.skewX * m.scaleY + this.transX * m.perSp1;
    res.value[6] =
      this.scaleX * m.transX + this.skewX * m.transY + this.transX * m.perSp2;

    res.value[1] =
      this.skewY * m.scaleX + this.scaleY * m.skewY + this.transY * m.perSp0;
    res.value[4] =
      this.skewY * m.skewX + this.scaleY * m.scaleY + this.transY * m.perSp1;
    res.value[7] =
      this.skewY * m.transX + this.scaleY * m.transY + this.transY * m.perSp2;

    res.value[2] =
      this.perSp0 * m.scaleX + this.perSp1 * m.scaleY + this.perSp2 * m.perSp0;
    res.value[5] =
      this.perSp0 * m.skewX + this.perSp1 * m.scaleY + this.perSp2 * m.perSp1;
    res.value[8] =
      this.perSp0 * m.transX + this.perSp1 * m.transY + this.perSp2 * m.perSp2;

    return res;
  }

  postTranslate(dx: number, dy: number) {
    this.value[6] += dx;
    this.value[7] += dy;
    return this;
  }

  mapPoints(pointArray: number[]) {
    if (
      pointArray.length == 0 ||
      (pointArray.length > 0 && pointArray.length % 2 !== 0)
    ) {
      throw new Error("mapPoints(pointArray), pointArray is invalid");
    }
    for (let i = 0; i + 1 < pointArray.length; i += 2) {
      const x = pointArray[i];
      const y = pointArray[i + 1];
      const [x0, y0] = this.mapPoint([x, y]);
      pointArray[i] = x0;
      pointArray[i + 1] = y0;
    }
    return pointArray;
  }

  mapPoint([x, y]: [number, number]) {
    const x0 = this.value[0] * x + this.value[3] * y + this.value[6];
    const y0 = this.value[1] * x + this.value[4] * y + this.value[7];
    return [x0, y0] as const;
  }

  toCanvasTransformParams() {
    return [
      this.scaleX,
      this.skewY,
      this.skewX,
      this.scaleY,
      this.transX,
      this.transY,
    ] as const;
  }
}
