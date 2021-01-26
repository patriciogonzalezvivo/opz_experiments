#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;

uniform sampler2D   u_tex0;
uniform vec2        u_tex0Resolution;

uniform vec2        u_resolution;
uniform float       u_time;

#include "opz.glsl"

#include "glslLib/space/ratio.glsl"
#include "glslLib/space/scale.glsl"

#include "glslLib/color/palette/heatmap.glsl"
#include "glslLib/color/palette/spectrum.glsl"

#include "glslLib/draw/fill.glsl"
#include "glslLib/draw/stroke.glsl"

#include "glslLib/draw/circleSDF.glsl"
#include "glslLib/draw/rectSDF.glsl"


#include "glslLib/math/const.glsl"

#define NORMALMAP_Z 0.5
#include "glslLib/operation/normalMap.glsl"

#define NOISED_QUINTIC_INTERPOLATION
#include "glslLib/generative/noised.glsl"

void main() {
    vec3 color = vec3(0.);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 pixel = 1.0/u_resolution;
    float time = u_time * 1.;

    vec2 uv = ratio(st, u_resolution);
    float tF = fract(uv.x * 12.0);
    float tI = float(uv.x * 12.0);
    float perc = max(max(u_kick, u_snare), max(u_perc, u_sample));
    float tone = max(max(u_bass, u_lead),  max(u_arp,  u_chord));

    float mask = 0.0;
    mask += stroke(tone, tI/12.0, 0.25);
    mask += perc * stroke(uv.x, fract(u_time * 0.1), 0.1);

#if defined(BUFFER_0)

    vec4 noise = noised(vec3(st * 10., time));

    vec2 st2 = vec2(uv.x, 1.0 - uv.y);
    st2 = ratio(st2, u_tex0Resolution.yx);
    st2 = scale(st2, u_tex0Resolution.y/u_tex0Resolution.x);
    vec3 normal = normalMap(u_tex0, st2, pixel);
    vec3 stream = texture2D(u_tex0, st2).rgb;
    vec2 displacement = vec2(0.0);
    // Try commenting this lines
    displacement += vec2(noise.x, 1.0);      // cascade 
    // displacement += noise.yz;                // low freq dynamic drops 
    // displacement += normal.xy;               // high freq static 
    vec3 prev  = texture2D(u_buffer1, st + displacement * pixel).rgb;
    
    // vec3 hU = spectrum( hF * 0.65 + 0.15 );
    // color += hU * texture2D(u_buffer1, st).rgb;

    
    color = mix(prev, stream, mask);
    // color = vec3(displacement, 0.);


#elif defined(BUFFER_1)
    color += texture2D(u_buffer0, st).rgb;

#else
    color += texture2D(u_buffer1, st).rgb;
    // color += fill(c, r*2.0);

#endif

    gl_FragColor = vec4(color,1.0);
}