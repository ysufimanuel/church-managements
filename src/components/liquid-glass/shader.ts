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
  vec3 bg = texture2D(uTex, vUv).rgb;
  vec2 fragPx = vUv * uRes;
  vec2 point = vec2(fragPx.x, uRes.y - fragPx.y);

  float bestSD = 1e9;
  vec2 bestP = vec2(0.0);
  vec2 bestHalf = vec2(0.0);
  float bestRadius = 1.0;
  float bend = 0.0;
  float ca = 0.0;
  float hi = 0.0;
  float tint = 0.0;
  bool found = false;

  for (int i = 0; i < 16; i++) {
    if (i >= uCount) break;
    vec4 rect = uRects[i];
    vec2 center = rect.xy + rect.zw * 0.5;
    vec2 halfSize = rect.zw * 0.5;
    float radius = min(uRadius[i], min(halfSize.x, halfSize.y));
    float sd = sdRoundBox(point - center, halfSize, radius);
    if (sd < bestSD) {
      bestSD = sd;
      bestP = point - center;
      bestHalf = halfSize;
      bestRadius = radius;
      bend = uBend[i];
      ca = uCA[i];
      hi = uHi[i];
      tint = uTint[i];
      found = true;
    }
  }

  // Transparent outside registered glass surfaces: the DOM remains untouched.
  if (!found || bestSD > 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float eps = 1.0;
  float dx = sdRoundBox(bestP + vec2(eps, 0.0), bestHalf, bestRadius)
           - sdRoundBox(bestP - vec2(eps, 0.0), bestHalf, bestRadius);
  float dy = sdRoundBox(bestP + vec2(0.0, eps), bestHalf, bestRadius)
           - sdRoundBox(bestP - vec2(0.0, eps), bestHalf, bestRadius);
  vec2 normal = normalize(vec2(dx, dy) + vec2(0.00001));
  float edge = 1.0 - smoothstep(0.0, 18.0, abs(bestSD));
  float wave = sin(bestP.x * 0.018 + uTime * 0.9) * sin(bestP.y * 0.021 - uTime * 0.7);
  vec2 ripple = vec2(wave, -wave) * 0.0015;
  vec2 mouseDist = (uMouse - vUv) * 0.012;
  vec2 refractUV = clamp(vUv + normal * (bend * 0.012 + edge * 0.0018) + ripple + mouseDist, 0.001, 0.999);

  float dispersion = ca + edge * 0.002;
  float red = texture2D(uTex, clamp(refractUV + normal * dispersion, 0.001, 0.999)).r;
  float green = texture2D(uTex, refractUV).g;
  float blue = texture2D(uTex, clamp(refractUV - normal * dispersion, 0.001, 0.999)).b;
  vec3 color = mix(vec3(red, green, blue), vec3(0.72, 0.76, 0.82), tint * 0.38);

  // Reflection is independent from the refracted backdrop sample.
  float rim = 1.0 - smoothstep(0.0, 2.8, abs(bestSD));
  float topBand = 1.0 - smoothstep(0.0, 22.0, abs(bestP.y + bestHalf.y - 5.0));
  float top = topBand * rim;
  float fresnel = pow(1.0 - abs(normal.x * 0.3 + 0.7), 2.0) * edge;
  float specular = pow(max(0.0, 1.0 - distance(vUv, uMouse) * 2.2), 3.0) * 0.25;
  float movingSweep = pow(max(0.0, 1.0 - abs(bestP.x / max(bestHalf.x, 1.0) - sin(uTime * 0.22) * 0.55) * 2.4), 5.0) * edge;
  color += vec3(1.0) * (rim * 0.55 * hi + top * 0.38 * hi + fresnel * 0.18 + specular + movingSweep * 0.12 * hi);
  color *= 0.96 + edge * 0.08;
  gl_FragColor = vec4(color, 1.0);
}
`;
