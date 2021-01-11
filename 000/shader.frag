

#ifdef GL_ES
precision mediump float;
#endif

uniform vec4        u_kick;
uniform vec4        u_snare;
uniform vec4        u_perc;
uniform vec4        u_sample;
uniform vec4        u_bass;
uniform vec4        u_lead;
uniform vec4        u_arp;
uniform vec4        u_chord;

// uniform vec3        u_light;
uniform vec3        u_camera;
uniform vec2        u_resolution;
uniform float       u_time;

varying vec4        v_position;

#ifdef MODEL_VERTEX_COLOR
varying vec4        v_color;
#endif

#ifdef MODEL_VERTEX_NORMAL
varying vec3        v_normal;
#endif

#ifdef MODEL_VERTEX_TEXCOORD
varying vec2        v_texcoord;
#endif

#ifdef MODEL_VERTEX_TANGENT
varying mat3        v_tangentToWorld;
varying vec4        v_tangent;
#endif

#include "space/ratio.glsl"
#include "generative/random.glsl"
#include "sample/textureShadow.glsl"
#include "color/palette/heatmap.glsl"
#include "shading/hatch.glsl"

float dist (vec2 st) {
    // return length(st);
    // return dot(st,st);
    // return min(abs(st.x+st.y),abs(st.x-st.y))+0.001;
    // return abs(st.x+st.y);
    // return abs(st.x)+abs(st.y);
    return abs(st.x);
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
}

void main(void) {
    vec3 color = vec3(0.0);
    vec2 st = gl_FragCoord.xy / u_resolution;

    st -= .5;
    
    float rInv = 1./dist(st);
    st = st * rInv - vec2(rInv,0.0);
    // st.y += sin(u_time * 0.01) * 25.;

#ifdef BACKGROUND
    st = ratio(st, u_resolution);
    vec2 grid = vec2(90.0, 60.0) * 0.5;

#else
    vec2 uv = v_texcoord;
    // st += uv.xy;
    st = uv;
    // color.rg += uv;

    vec2 grid = vec2(90.0, 60.0) * 5.0;

    #ifdef MODEL_VERTEX_NORMAL
    // vec3 normal = v_normal;
    // color += tonemap(sphericalHarmonics(normal));
    // float shade = smoothstep(-1.0, 1.0, dot(normal, normalize(u_light)));
    // color *= shade;

    float den = 200.0;
    vec3 l = normalize(u_light);
    vec3 n = normalize(v_normal);
    vec3 v = normalize(u_camera);
    vec3 h = normalize(l + v);
    float t = dot(n, l) * 0.5 + 0.5;
    float s = max(0.0, dot(n, h));
    s = pow(s, 50.0);
    // float outline = 1.0-step(0.5, pow(1.0 - clamp(dot(v , n), 0.0, 1.0), 3.) );

    float shade = t + s;
#ifdef LIGHT_SHADOWMAP
    float shadows = 1.0 - step(textureShadow(u_lightShadowMap, v_lightCoord), v_lightCoord.z - 0.005) * 0.5;
    shade *= shadows;
#endif

    color += hatch(n, 12.0, den, shade * shade * shade * shade);
    #endif

#endif
    st *= grid;

    vec2 ipos = floor(st);  // integer
    vec2 fpos = fract(st);  // fraction

    vec2 vel = vec2(u_time*-2.*max(grid.x,grid.y)); // time
    vel *= vec2(-1.,0.0) * random(ipos.y + u_kick.x + u_snare.x + u_perc.x); // direction

    // Assign a random value base on the integer coord
    vec2 offset = vec2(0.1,0.);

    float amount = u_lead.y * 0.25 + u_chord.y * 0.25 + 0.5;
    float margin = u_arp.y * 0.5 + 0.5;

    // Margins
    color += pattern(st, vel, amount) *
            step(margin * .2, fpos.y) * 
            (1.0-smoothstep(-0.192,0.856,rInv*0.128));

    // color = heatmap(fract(rInv));
    // color.rg = st;

    gl_FragColor = vec4(color, 1.0);
}

