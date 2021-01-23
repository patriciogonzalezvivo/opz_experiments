

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;
uniform sampler2D   u_buffer2;
uniform sampler2D   u_scene;
uniform sampler2D   u_sceneDepth;

uniform vec3        u_camera;
uniform vec2        u_resolution;
uniform float       u_time;

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

#define GAUSSIANBLUR_2D
#include "glslLib/filter/gaussianBlur.glsl"
#include "glslLib/filter/radialBlur.glsl"

#include "glslLib/fx/barrelDistortion.glsl"

#define CHROMAAB_SAMPLER_FNC(POS_UV) barrelDistortion(tex, POS_UV, 0.01)
#define CHROMAAB_PCT 1.5
#include "glslLib/fx/chromaAB.glsl"

#include "glslLib/operation/stretch.glsl"

#define ANAMORPHIC_SAMPLER_FNC(POS_UV) texture2D(tex, POS_UV).g
#include "glslLib/fx/anamorphic.glsl"

void main(void) {
    vec3 color = vec3(0.0);
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 pixel = 1./u_resolution.xy;

#if defined(BUFFER_0)
    color = texture2D(u_scene, st).rgb * 0.5;
    color += gaussianBlur13(u_scene, st, pixel * 2.0).rgb;
    // color += radialBlur(u_scene, st, -(st - 0.5), .65).rgb;

#elif defined(BUFFER_1)
    // color = anamorphic(u_scene, st, 0.95, 100.0, .5) * vec3(0.5,0.4,1.0) * 0.25;
    color = anamorphic(u_buffer0, st, 1., 100.0, .5) * vec3(0.5,0.4,0.0) * step(u_postprocessing,1.) * 0.05;

#elif defined(BUFFER_2)
    color = gaussianBlur13(u_buffer1, st, pixel * 2.0).rgb;

#elif defined(POSTPROCESSING)
    // color = texture2D(u_scene, st).rgb * 0.5;
    color += chromaAB(u_scene, st - pixel).rgb;
    // color += chromaAB(u_buffer0, st - pixel).rgb;
    color += gaussianBlur13(u_buffer1, st, pixel * 2.0).rgb * 0.5;

// #if defined(POSTPROCESSING)
//     // color = postprocessing(st);
//     color = texture2D(u_scene, st).rgb;

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

