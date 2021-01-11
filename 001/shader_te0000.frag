#ifdef GL_ES
precision mediump float;
#endif

uniform float       u_clock;
uniform float       u_kick;
uniform float       u_snare;
uniform float       u_perc;
uniform float       u_sample;
uniform float       u_bass;
uniform float       u_lead;
uniform float       u_arp;
uniform float       u_chord;

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;
uniform vec2        u_resolution;
uniform float       u_time;

vec3 teRED = vec3(209.0/255.0, 29.0/255.0, 50.0/255.0);
vec3 teGREEN = vec3(1.0/255.0, 88.0/255.0, 47.0/255.0);
vec3 teYELLOW = vec3(242.0/255.0, 159.0/255.0, 5.0/255.0);
vec3 teBLUE = vec3(24.0/255.0, 93.0/255.0, 131.0/255.0);
vec3 teGREY = vec3(208.0/255.0, 208.0/255.0, 208.0/255.0);

float getChannel(int channel) {
    float tracks[8];
    tracks[0] = u_kick;
    tracks[1] = u_snare;
    tracks[2] = u_perc;
    tracks[3] = u_sample;
    tracks[4] = u_bass;
    tracks[5] = u_lead;
    tracks[6] = u_arp;
    tracks[7] = u_chord;

    return tracks[channel];
}

#include "math/const.glsl"
#include "space/ratio.glsl"
#include "space/scale.glsl"
#include "space/rotate.glsl"

#include "draw/fill.glsl"
#include "draw/stroke.glsl"
#include "draw/circleSDF.glsl"
#include "draw/crossSDF.glsl"

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

    color += texture2D(u_buffer0, st + offset).rgb * 0.999;

    float col_f = floor(st.y * 8.0); 
    int col = int(col_f);
    float tone = getChannel(col);
    color += fill(col_f/8.0, tone) * stroke(st.x, 0.0, pixel.x);
    
#else
    vec2 uv = ratio(st, u_resolution);

    vec3 colors[4];
    colors[0] = teGREEN;
    colors[1] = teBLUE;
    colors[2] = teYELLOW;
    colors[3] = teRED;

    // wheels
    color += teGREY * encoder(scale(uv, 1.5) + vec2(-0.35, -0.4), -u_clock * 0.5);
    color += teGREY * encoder(scale(uv, 1.5) + vec2(+0.35, -0.4), -u_clock * 0.5);

    st *= vec2(1., 2.);
    float col_f = floor(st.y * 8.0); 
    int col = int(col_f);
    float tone = getChannel(col);

    color += colors[int(mod(col_f,4.))] * texture2D(u_buffer1, st).rgb * step(st.y, 1.0);
    color += colors[int(mod(col_f,4.))] * tone;
#endif

    gl_FragColor = vec4(color, 1.0);
}

