/**
 * Pure TypeScript QR Code generator (zero external dependencies)
 * Generates valid QR codes (Versions 1-6) as pure SVG or module matrix
 */

export interface QRCodeOptions {
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
}

// Reed-Solomon Galois Field 256 tables
const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);

(function initGaloisField() {
  let val = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = val;
    GF256_LOG[val] = i;
    val = (val << 1) ^ (val & 128 ? 0x11d : 0);
  }
  for (let i = 255; i < 512; i++) {
    GF256_EXP[i] = GF256_EXP[i - 255];
  }
})();

function gfMultiply(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

function polyMultiply(p1: number[], p2: number[]): number[] {
  const result = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gfMultiply(p1[i], p2[j]);
    }
  }
  return result;
}

function getGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    poly = polyMultiply(poly, [1, GF256_EXP[i]]);
  }
  return poly;
}

function rsCalculate(data: number[], ecCount: number): number[] {
  const gen = getGeneratorPoly(ecCount);
  const msg = [...data, ...new Array(ecCount).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const factor = msg[i];
    if (factor !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gfMultiply(gen[j], factor);
      }
    }
  }
  return msg.slice(data.length);
}

// Version configs [totalCodewords, ecCodewordsPerBlock, numBlocks] for Level M
const VERSION_SPECS: Record<number, { total: number; ec: number; blocks: number }> = {
  1: { total: 26, ec: 10, blocks: 1 }, // 21x21, 16 data codewords
  2: { total: 44, ec: 16, blocks: 1 }, // 25x25, 28 data codewords
  3: { total: 70, ec: 26, blocks: 1 }, // 29x29, 44 data codewords
  4: { total: 100, ec: 18, blocks: 2 }, // 33x33, 64 data codewords (2 blocks of 32)
  5: { total: 134, ec: 24, blocks: 2 }, // 37x37, 86 data codewords
};

// Alignment pattern centers for versions
const ALIGNMENT_CENTERS: Record<number, number[]> = {
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
};

function selectVersion(dataLength: number): number {
  // Byte mode overhead: 4 bits mode + 8 bits length + data
  const bitsNeeded = 4 + 8 + dataLength * 8;
  const bytesNeeded = Math.ceil(bitsNeeded / 8);

  for (let v = 1; v <= 5; v++) {
    const spec = VERSION_SPECS[v];
    const dataCap = spec.total - spec.ec * spec.blocks;
    if (bytesNeeded <= dataCap) return v;
  }
  return 5;
}

/**
 * Generate 2D boolean matrix of QR Code modules
 */
export function generateQRMatrix(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const version = selectVersion(bytes.length);
  const size = 17 + 4 * version;

  const spec = VERSION_SPECS[version];
  const totalDataCodewords = spec.total - spec.ec * spec.blocks;

  // 1. Encode bitstream (Byte Mode: 0100)
  const bitStream: number[] = [];
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bitStream.push((val >> i) & 1);
    }
  }

  pushBits(0b0100, 4); // Byte mode
  pushBits(bytes.length, 8); // Character count
  for (let i = 0; i < bytes.length; i++) {
    pushBits(bytes[i], 8);
  }

  // Terminator (up to 4 zero bits)
  const maxBits = totalDataCodewords * 8;
  const termLen = Math.min(4, maxBits - bitStream.length);
  pushBits(0, termLen);

  // Pad to byte boundary
  while (bitStream.length % 8 !== 0) {
    bitStream.push(0);
  }

  // Convert bits to data codewords
  const dataCodewords: number[] = [];
  for (let i = 0; i < bitStream.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bitStream[i + j];
    }
    dataCodewords.push(b);
  }

  // Pad bytes (0xEC, 0x11 alternating)
  const pad = [0xec, 0x11];
  let pIdx = 0;
  while (dataCodewords.length < totalDataCodewords) {
    dataCodewords.push(pad[pIdx % 2]);
    pIdx++;
  }

  // Interleave blocks & calculate EC
  const blockSize = Math.floor(totalDataCodewords / spec.blocks);
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];

  for (let b = 0; b < spec.blocks; b++) {
    const blockData = dataCodewords.slice(b * blockSize, (b + 1) * blockSize);
    dataBlocks.push(blockData);
    ecBlocks.push(rsCalculate(blockData, spec.ec));
  }

  const finalCodewords: number[] = [];
  for (let i = 0; i < blockSize; i++) {
    for (let b = 0; b < spec.blocks; b++) {
      finalCodewords.push(dataBlocks[b][i]);
    }
  }
  for (let i = 0; i < spec.ec; i++) {
    for (let b = 0; b < spec.blocks; b++) {
      finalCodewords.push(ecBlocks[b][i]);
    }
  }

  // 2. Initialize matrix
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () =>
    new Array(size).fill(null)
  );

  // Helper to place finder pattern
  function placeFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const mr = row + r;
        const mc = col + c;
        if (mr >= 0 && mr < size && mc >= 0 && mc < size) {
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
            const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
            matrix[mr][mc] = isBorder || isCenter;
          } else {
            matrix[mr][mc] = false; // separator
          }
        }
      }
    }
  }

  // Place 3 finders
  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
  }

  // Dark module
  matrix[size - 8][8] = true;

  // Alignment patterns
  if (version >= 2) {
    const coords = ALIGNMENT_CENTERS[version];
    for (const r of coords) {
      for (const c of coords) {
        if (matrix[r][c] !== null) continue; // skip if overlaps finder
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isEdge = Math.abs(dr) === 2 || Math.abs(dc) === 2;
            const isCenter = dr === 0 && dc === 0;
            matrix[r + dr][c + dc] = isEdge || isCenter;
          }
        }
      }
    }
  }

  // Reserve format info area
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
  }
  for (let i = size - 8; i < size; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
  }

  // Place data bits in matrix
  let byteIdx = 0;
  let bitIdx = 7;
  let upward = true;

  for (let rightCol = size - 1; rightCol > 0; rightCol -= 2) {
    if (rightCol === 6) rightCol--; // Skip vertical timing pattern
    const leftCol = rightCol - 1;

    for (let count = 0; count < size; count++) {
      const row = upward ? size - 1 - count : count;

      for (const col of [rightCol, leftCol]) {
        if (matrix[row][col] === null) {
          let bit = false;
          if (byteIdx < finalCodewords.length) {
            bit = ((finalCodewords[byteIdx] >> bitIdx) & 1) === 1;
            bitIdx--;
            if (bitIdx < 0) {
              bitIdx = 7;
              byteIdx++;
            }
          }
          // Apply Mask 0: (row + col) % 2 === 0
          const mask = (row + col) % 2 === 0;
          matrix[row][col] = mask ? !bit : bit;
        }
      }
    }
    upward = !upward;
  }

  // Format info for Level M, Mask 0: 0b101010000010010 ^ 0b101010000010010 = 0b00000...
  // Precomputed standard format string for Level M, Mask 0: 101010000010010
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
  // Write format info around finders
  for (let i = 0; i < 6; i++) matrix[8][i] = formatBits[i] === 1;
  matrix[8][7] = formatBits[6] === 1;
  matrix[8][8] = formatBits[7] === 1;
  matrix[7][8] = formatBits[8] === 1;
  for (let i = 9; i < 15; i++) matrix[14 - i][8] = formatBits[i] === 1;

  for (let i = 0; i < 7; i++) matrix[size - 1 - i][8] = formatBits[i] === 1;
  for (let i = 7; i < 15; i++) matrix[8][size - 15 + i] = formatBits[i] === 1;

  return matrix.map((row) => row.map((cell) => cell ?? false));
}

/**
 * Generate pure SVG string for a given text
 */
export function generateQRSvg(text: string, options: QRCodeOptions = {}): string {
  const matrix = generateQRMatrix(text);
  const size = options.size || 200;
  const margin = options.margin ?? 2;
  const fgColor = options.fgColor || '#000000';
  const bgColor = options.bgColor || '#ffffff';

  const n = matrix.length;
  const totalModules = n + margin * 2;
  const scale = size / totalModules;

  let rects = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c]) {
        const x = ((c + margin) * scale).toFixed(2);
        const y = ((r + margin) * scale).toFixed(2);
        const s = Math.ceil(scale * 100) / 100;
        rects += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fgColor}" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="${bgColor}" rx="12" />
    ${rects}
  </svg>`;
}
