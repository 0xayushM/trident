// ─── Clip-path card shape geometry ────────────────────────────────────────────

export interface CardPathConfig {
  W: number;
  H: number;
  stepFlatW: number;
  stepH: number;
  stepDiagW: number;
  stepRadius: number;
  tr: number;
  slotDepth: number;
  slotFlatH: number;
  slotAngleH: number;
  slotPosPct: number;
  slotIR: number;
  slotER: number;
  br: number;
  bl: number;
}

export function buildCardPath(c: CardPathConfig): string {
  const {
    W,
    H,
    stepFlatW: fw,
    stepH,
    stepDiagW: dw,
    stepRadius: sr,
    tr,
    slotDepth: sd,
    slotFlatH,
    slotAngleH,
    slotPosPct,
    slotIR,
    slotER,
    br,
    bl,
  } = c;

  const diagLen = Math.sqrt(dw * dw + stepH * stepH);
  const ddx = dw / diagLen,
    ddy = stepH / diagLen;
  const sr2 = Math.min(sr, fw / 2, stepH / 2, diagLen / 2 - 1);

  const A = { s: [0, stepH + sr2], cp: [0, stepH], e: [sr2, stepH] };
  const B = {
    s: [fw - sr2, stepH],
    cp: [fw, stepH],
    e: [fw + sr2 * ddx, stepH - sr2 * ddy],
  };
  const C = {
    s: [fw + dw - sr2 * ddx, sr2 * ddy],
    cp: [fw + dw, 0],
    e: [fw + dw + sr2, 0],
  };

  const slMid = H * (slotPosPct / 100);
  const slT = slMid - slotFlatH / 2 - slotAngleH;
  const slB = slMid + slotFlatH / 2 + slotAngleH;
  const slFT = slMid - slotFlatH / 2;
  const slFB = slMid + slotFlatH / 2;
  const taLen = Math.sqrt(sd * sd + slotAngleH * slotAngleH);
  const tadx = sd / taLen,
    tady = slotAngleH / taLen;
  const ir = Math.min(slotIR, slotFlatH / 2, sd / 2);
  const er = Math.min(slotER, slotAngleH / 2);

  const pt = (x: number, y: number) => `${+x.toFixed(2)},${+y.toFixed(2)}`;

  return [
    `M ${pt(...(A.s as [number, number]))}`,
    `Q ${pt(...(A.cp as [number, number]))} ${pt(...(A.e as [number, number]))}`,
    `L ${pt(...(B.s as [number, number]))}`,
    `Q ${pt(...(B.cp as [number, number]))} ${pt(...(B.e as [number, number]))}`,
    `L ${pt(...(C.s as [number, number]))}`,
    `Q ${pt(...(C.cp as [number, number]))} ${pt(...(C.e as [number, number]))}`,
    `L ${W - tr},0  Q ${W},0 ${W},${tr}`,
    `L ${W},${slT - er}  Q ${W},${slT} ${pt(W - er * tadx, slT + er * tady)}`,
    `L ${pt(W - sd + ir * tadx, slFT - ir * tady)}  Q ${pt(W - sd, slFT)} ${pt(W - sd, slFT + ir)}`,
    `L ${pt(W - sd, slFB - ir)}  Q ${pt(W - sd, slFB)} ${pt(W - sd + ir * tadx, slFB + ir * tady)}`,
    `L ${pt(W - er * tadx, slB - er * tady)}  Q ${W},${slB} ${W},${slB + er}`,
    `L ${W},${H - br}  Q ${W},${H} ${W - br},${H}`,
    `L ${bl},${H}  Q 0,${H} 0,${H - bl}`,
    `L ${pt(...(A.s as [number, number]))} Z`,
  ].join(' ');
}
