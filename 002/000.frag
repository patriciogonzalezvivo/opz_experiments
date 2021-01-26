#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;
uniform vec2        u_resolution;
uniform float       u_time;

#include "opz.glsl"

#include "glslLib/space/ratio.glsl"

#include "glslLib/color/palette/heatmap.glsl"
#include "glslLib/color/palette/spectrum.glsl"

#include "glslLib/draw/fill.glsl"

#include "glslLib/draw/circleSDF.glsl"

void main() {
    vec3 color = vec3(0.);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 pixel = 1.0/u_resolution;

    vec2 uv = ratio(st, u_resolution);
    float hI = floor(uv.y*8.0);
    float hF = fract(uv.y*8.0);
    float tone = 1.0/96.0;
    float pct = u_lead + tone * 0.5;
    // pct = fract(pct*7.);

#if defined(BUFFER_0)
    color += texture2D(u_buffer1, st).rgb;

    float r = tone * 0.25;
    float c = circleSDF(uv + vec2(0.5-r, mix(0.5-r, -0.5+r, pct)));

    color += fill(c, r*2.0) * step(0.01, pct);

#elif defined(BUFFER_1)
    color = texture2D(u_buffer0, st + pixel * vec2(-1.0, 0.)).rgb * 0.993;

#else
    color += texture2D(u_buffer1, st).rgb;
    
    float h = floor(hF*12.0)/12.0; 
    vec3 hU = spectrum( h * 0.65 + 0.15 );

    // color += hU;
    color = hU * color;
    color += step(hF, 0.01) * 0.2;


#endif

    gl_FragColor = vec4(color,1.0);
}