#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;
uniform vec2        u_resolution;
uniform float       u_time;

#include "opz.glsl"
#include "color/space/hsv2rgb.glsl"

void main(void) {
    vec3 color = vec3(0.0);
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 pixel = 1.0/u_resolution;

    float track = floor(st.x * 8.0);
    float tone = getChannel(track);
    vec3  hue = hsv2rgb( vec3(track / 8.0, 1., 1.) );

#if defined(BUFFER_0)
    color += texture2D(u_buffer1, st).r;

#elif defined(BUFFER_1)
    color += mix(texture2D(u_buffer0, st).r, tone, 0.1);

#else
    color += hue * step(st.y, texture2D(u_buffer1, st).r) * step(0.5, fract(st.y * 100.));

#endif


    gl_FragColor = vec4(color, 1.0);
}

