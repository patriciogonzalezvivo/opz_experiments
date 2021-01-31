#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;
uniform sampler2D   u_buffer2;
uniform sampler2D   u_buffer3;
uniform sampler2D   u_buffer4;

uniform sampler2D   u_tex0;
uniform vec2        u_tex0Resolution;

uniform vec2        u_resolution;
uniform float       u_time;

#include "opz.glsl"

#include "glslLib/space/ratio.glsl"
#include "glslLib/space/scale.glsl"

#include "glslLib/operation/opticalFlow.glsl"

#define GAUSSIANBLUR_2D
#include "glslLib/filter/gaussianBlur.glsl"

#define NOISED_QUINTIC_INTERPOLATION
#include "glslLib/generative/noised.glsl"

#include "glslLib/color/palette/spectrum.glsl"
#include "glslLib/color/palette/heatmap.glsl"

void main() {
    vec3 color = vec3(0.);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 pixel = 1.0/u_resolution;
    float time = u_time * 1.;

    vec2 uv = ratio(st, u_resolution);

    vec2 st2 = st;
    st2 = ratio(st2, u_tex0Resolution.yx);
    st2 = scale(st2, u_tex0Resolution.y/u_tex0Resolution.x);

    float mask = 1.0;

#if defined(BUFFER_0)
    vec3 stream = texture2D(u_tex0, st2).rgb;

    vec2 displacement = vec2(0.0);
    displacement = texture2D(u_buffer3, st2).rg * 2.0 - 1.0;
    mask = length(displacement);
    // mask = max(mask, u_chord);

    vec3 prev  = texture2D(u_buffer1, st - displacement * 10. * pixel).rgb;
    color += mix(prev, stream, pow(mask,2.));
    color += spectrum(abs(mask)) * max(u_kick, u_perc * 0.1) * 0.1;


#elif defined(BUFFER_1)
    color += texture2D(u_buffer0, st).rgb;

#elif defined(BUFFER_2)
    color += texture2D(u_buffer3, st).rgb;

#elif defined(BUFFER_3)    
    vec2 displacement = vec2(0.0);;
    displacement = texture2D(u_buffer2, st).rg * 2.0 - 1.0;
    // displacement = (gaussianBlur13(u_buffer2, st, pixel).rg * 2.0 - 1.0);

    // color.rg += (texture2D(u_buffer2, st - displacement * pixel).rg * 2.0 - 1.0) * 0.95;
    color.rg += (gaussianBlur13(u_buffer2, st - displacement * 10. * pixel, pixel).rg * 2.0 - 1.0) * 0.95;
    color.rg += opticalFlow(u_buffer4, u_tex0, st, pixel);
    color.rg = clamp(color.rg, vec2(-1.), vec2(1.));
    color.rg = color.rg * 0.5 + 0.5;

#elif defined(BUFFER_4)
    color += texture2D(u_tex0, st).rgb;

#else
    color += texture2D(u_buffer1, st).rgb;

#endif

    gl_FragColor = vec4(color,1.0);
}