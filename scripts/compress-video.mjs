#!/usr/bin/env node
/**
 * 웹용 동영상 압축 (무음 자동재생 클립). Philosophy/Professional 미디어에 동일 적용.
 *
 * 사용법:
 *   node scripts/compress-video.mjs <입력.mp4> [출력.mp4] [최대폭=800]
 *
 * 예) 원본을 그 자리에서 압축(원본은 .orig 로 백업):
 *   node scripts/compress-video.mjs public/companies/111percent.mp4
 *
 * 설정: H.264 / CRF 30 / 폭 최대 800px / 무음(-an) / +faststart
 */
import { execFileSync } from "node:child_process";
import { existsSync, renameSync } from "node:fs";
import { resolve } from "node:path";
import ffmpeg from "ffmpeg-static";

const [input, outputArg, widthArg] = process.argv.slice(2);
if (!input) {
  console.error("사용법: node scripts/compress-video.mjs <입력.mp4> [출력.mp4] [최대폭=800]");
  process.exit(1);
}
const inPath = resolve(input);
if (!existsSync(inPath)) {
  console.error(`❌ 입력 파일이 없습니다: ${inPath}`);
  process.exit(1);
}
const maxW = Number(widthArg) || 800;

// 출력 미지정 시 입력을 덮어씀 (원본은 .orig 백업)
const inPlace = !outputArg;
const outPath = inPlace ? inPath : resolve(outputArg);
const tmpPath = outPath.replace(/\.mp4$/i, ".tmp.mp4");

console.log(`🎬 압축: ${input} (max ${maxW}px, CRF30, 무음)`);
execFileSync(
  ffmpeg,
  [
    "-y", "-i", inPath,
    "-vf", `scale='min(${maxW},iw)':-2`,
    "-c:v", "libx264", "-crf", "30", "-preset", "slow",
    "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
    tmpPath,
  ],
  { stdio: ["ignore", "ignore", "inherit"] }
);

if (inPlace) {
  renameSync(inPath, inPath.replace(/\.mp4$/i, ".orig.mp4"));
  renameSync(tmpPath, outPath);
  console.log(`✅ 완료. 원본 백업: ${input.replace(/\.mp4$/i, ".orig.mp4")}`);
} else {
  renameSync(tmpPath, outPath);
  console.log(`✅ 완료: ${outputArg}`);
}
