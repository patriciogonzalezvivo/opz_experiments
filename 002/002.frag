#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;

uniform sampler2D   u_tex0;
uniform vec2        u_tex0Resolution;

uniform vec2        u_resolution;
uniform float       u_time;

#include "glslLib/space/ratio.glsl"
#include "glslLib/space/scale.glsl"

#include "glslLib/color/space/all.glsl"
#include "glslLib/color/levels/gamma.glsl"

#include "glslLib/fx/barrelDistortion.glsl"
#define CHROMAAB_SAMPLER_FNC(POS_UV) barrelDistortion(tex, POS_UV, 0.015)
#define CHROMAAB_PCT 1.5
#include "glslLib/fx/chromaAB.glsl"

#include "glslLib/generative/snoise.glsl"

void main() {
    vec3 color = vec3(0.);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 uv = ratio(st, u_resolution);
    vec2 pixel = 1.0/u_resolution;
    float time = u_time * 1.;

#if defined(BUFFER_0)
    vec2 tex0st = vec2(1.0-uv.x, uv.y);
    tex0st = ratio(tex0st, u_tex0Resolution.yx);
    tex0st = scale(tex0st, u_tex0Resolution.y/u_tex0Resolution.x);

    vec2 uv_i = floor(uv * 20.0);

    float n = snoise(vec3(uv_i * 0.025, u_time * 0.5 + uv_i.y ));
    n = step(0.75, n);

    color = texture2D(u_tex0, tex0st + n * vec2(1., 3.) * pixel ).rgb;
    color = mix(color, color * vec3(0.902, 1.0, 1.0), n);
    color -= (sin(gl_FragCoord.y * 1.5) * 0.5 + 0.5) * 0.1;

#else
    st = scale(st, 0.95);
    color = chromaAB(u_buffer0, st - pixel) * 1.25;
    color = gamma2linear(color);

#endif

    gl_FragColor = vec4(color,1.0);
}