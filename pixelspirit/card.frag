

#ifdef GL_ES
precision mediump float;
#endif

uniform vec3        u_camera;
uniform vec2        u_resolution;
uniform float       u_time;

// #define TEXTUREDOF_BLUR_SIZE 13.0
// #define TEXTUREDOF_RAD_SCALE 0.5
// #include "sample/textureDoF.glsl"

varying vec4    v_position;

#ifdef MODEL_VERTEX_COLOR
varying vec4    v_color;
#endif

#ifdef MODEL_VERTEX_NORMAL
varying vec3    v_normal;
#endif

#ifdef MODEL_VERTEX_TEXCOORD
varying vec2    v_texcoord;
#endif

#ifdef MODEL_VERTEX_TANGENT
varying mat3    v_tangentToWorld;
varying vec4    v_tangent;
#endif

#include "opz.glsl"
#include "lighting.glsl"
#include "postprocessing.glsl"
#include "cardContent.glsl"
#include "backgroundContent.glsl"

void main(void) {
    vec3 color = vec3(0.0);
    vec2 st = gl_FragCoord.xy / u_resolution;

#if defined(POSTPROCESSING)
    color = postprocessing(st);

#elif defined(BACKGROUND)
    color = backgroundContent(st) * 0.5;

#else
    Material mat = MaterialInit();
    #ifdef MATERIAL_NAME_FRONT
    cardContent(mat.baseColor.rgb);
    #endif
    color = pbr(mat).rgb;
#endif
    
    gl_FragColor = vec4(color, 1.0);
}

