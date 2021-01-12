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
    st.y = 1.0-st.y;
    vec2 pixel = 1.0/u_resolution;
    int col = int(floor(st.x * 8.0));
    float tone = getChannel(col);
    vec3 hue = hsv2rgb(vec3( float(col) / 8.0, 1., tone) );

#if defined(BUFFER_0)
    color = texture2D(u_buffer1, st).rgb;

#elif defined(BUFFER_1)
    color += texture2D(u_buffer0, st + pixel * vec2(0.0, 1.)).rgb * 0.999;

    float pct = 1.0 - smoothstep(0.0, 0.01, st.y);
    color += hue * pct;
    
#else
    color = texture2D(u_buffer1, st).rgb;
    color += hue;
#endif

    gl_FragColor = vec4(color, 1.0);
}

