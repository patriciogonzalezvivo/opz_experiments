#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;
uniform vec2        u_resolution;
uniform float       u_time;

#include "opz.glsl"

#include "math/const.glsl"
#include "space/ratio.glsl"
#include "space/scale.glsl"
#include "space/rotate.glsl"

#include "draw/fill.glsl"
#include "draw/stroke.glsl"
#include "draw/circleSDF.glsl"
#include "draw/crossSDF.glsl"

#include "color/space/hsv2rgb.glsl"

float encoder(vec2 _st, float _angle) {
    float v = 0.0;

    _st = rotate(_st, _angle);

    float c1 = circleSDF(_st);
    float c2 = crossSDF(_st, .7);
    v += fill(c1, 0.5) *
            (1.0-stroke(_st.x, 0.5, 0.05, 0.0002)) *
            (1.0-fill(c1, 0.2)) +
         fill(c2, 0.15);

    return v;
}

void main(void) {
    vec3 color = vec3(0.0);
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 pixel = 1.0/u_resolution;

#if defined(BUFFER_0)
    color = texture2D(u_buffer1, st).rgb;

#elif defined(BUFFER_1)
    vec2 offset = vec2(0.0);
    #ifdef OPZ_PLAYING
    offset = pixel * vec2(-1.0, 0.);
    #endif

    color += texture2D(u_buffer0, st + offset).rgb;

    float col_f = floor(st.y * 8.0); 
    int col = int(col_f);
    float tone = getOpzChannel(col);
    color += tone * step(st.x, 0.001);
    
#else
    vec2 uv = ratio(st, u_resolution);

    // wheels
    color += OPZ_GREY * encoder(scale(uv, 1.5) + vec2(-0.35, -0.45), -u_clock * 0.5);
    color += OPZ_GREY * encoder(scale(uv, 1.5) + vec2(+0.35, -0.45), -u_clock * 0.5);

    st *= vec2(1., 1.7);
    float col_f = floor(st.y * 8.0); 
    int col = int(col_f);
    float tone = getOpzChannel(col);

    float val = tone * 0.5 + texture2D(u_buffer1, st).r;
    color += hsv2rgb(vec3( float(col) / 8.0, 1., val)) * step(st.y, 1.0);
#endif

    gl_FragColor = vec4(color, 1.0);
}

