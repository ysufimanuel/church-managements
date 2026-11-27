export const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main() {
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}
`;

export const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform sampler2D uTex;
uniform float uTime;
uniform vec2 uMouse;
uniform vec4 uRects[16];
uniform float uRadius[16];
uniform float uBend[16];
uniform float uCA[16];
uniform float uHi[16];
uniform float uTint[16];
uniform int uCount;

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  float bestSD = 1e9;
  vec2 bestCenter = vec2(0.0);
  vec2 bestSize = vec2(0.0);
  float bestRadius = 28.0;
  float bend = 0.06;
  float ca = 0.006;
  float hi = 0.9;
  float tint = 0.12;

  for (int i = 0; i < 16; i++) {
    if (i >= uCount) break;
    vec4 rect = uRects[i];
    vec2 center = vec2((rect.x + rect.z * 0.5) / uRes.x, 1.0 - (rect.y + rect.w * 0.5) / uRes.y);
    vec2 size = vec2(rect.z / uRes.x, rect.w / uRes.y) * aspect * 0.5;
    vec2 p = (vUv - center) * aspect;
    float radius = uRadius[i] / uRes.x * aspect.x;
    float sd = sdRoundBox(p, size, radius);
    if (sd < bestSD) {
      bestSD = sd;
      bestCenter = center;
      bestSize = size;
      bestRadius = radius;
      bend = uBend[i];
      ca = uCA[i];
      hi = uHi[i];
      tint = uTint[i];
    }
  }

  // Canvas stays transparent outside glass, so the actual page remains visible.
  if (bestSD > 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec2 p = (vUv - bestCenter) * aspect;
  float e = 0.0015;
  float sdX = sdRoundBox(p + vec2(e, 0.0), bestSize, bestRadius) - bestSD;
  float sdY = sdRoundBox(p + vec2(0.0, e), bestSize, bestRadius) - bestSD;
  vec2 normal = normalize(vec2(sdX, sdY) / e + 0.0001);

  // The source demo used reversed smoothstep edges; express the same falloff portably.
  float edge = 1.0 - smoothstep(0.0, 0.06, abs(bestSD));
  float wave = sin(p.x * 30.0 + uTime * 0.9) * sin(p.y * 34.0 - uTime * 0.7);
  vec2 ripple = vec2(wave, -wave) * 0.004;
  vec2 mouseD = (uMouse - vUv) * 0.03;
  float localBend = bend + edge * 0.10;
  vec2 refractUV = clamp(vUv + normal * localBend + ripple + mouseD, 0.001, 0.999);

  float dispersion = ca + edge * 0.006;
  float red = texture2D(uTex, clamp(refractUV + normal * dispersion, 0.001, 0.999)).r;
  float green = texture2D(uTex, refractUV).g;
  float blue = texture2D(uTex, clamp(refractUV - normal * dispersion, 0.001, 0.999)).b;
  vec3 color = mix(vec3(red, green, blue), vec3(0.7), tint * 0.4);

  // Independent optical reflection layers from the original local demo.
  float rim = 1.0 - smoothstep(0.0, 0.006, abs(bestSD));
  float top = (1.0 - smoothstep(0.0, 0.12, abs(p.y - bestSize.y + 0.008))) * rim;
  float fresnel = pow(1.0 - abs(normal.x * 0.3 + 0.7), 2.0) * edge;
  float specular = pow(max(0.0, 1.0 - distance(vUv, uMouse) * 2.2), 3.0) * 0.25;
  color += vec3(1.0) * (rim * 0.55 * hi + top * 0.75 * hi + fresnel * 0.18 + specular);
  color *= 0.94 + edge * 0.12;
  gl_FragColor = vec4(color, 1.0);
}
`;
