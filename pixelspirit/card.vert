
#ifdef GL_ES
precision mediump float;
#endif

uniform mat4    u_modelViewProjectionMatrix;
uniform float   u_angle;

attribute vec4  a_position;
varying vec4    v_position;

#ifdef MODEL_VERTEX_NORMAL
attribute vec3  a_normal;
varying vec3    v_normal;
#endif

#ifdef MODEL_VERTEX_TEXCOORD
attribute vec2  a_texcoord;
varying vec2    v_texcoord;
#endif

#ifdef MODEL_VERTEX_TANGENT
attribute vec4  a_tangent;
varying vec4    v_tangent;
varying mat3    v_tangentToWorld;
#endif

#include "glslLib/math/rotate4dY.glsl"

void main(void) {
    v_position = a_position;

    mat4 rot = rotate4dY(u_angle * 0.5);
    v_position = rot * v_position;
    
#ifdef MODEL_VERTEX_NORMAL
    v_normal = a_normal;
    v_normal = (rot * vec4(v_normal,1.)).xyz;
#endif
    
#ifdef MODEL_VERTEX_TEXCOORD
    v_texcoord = a_texcoord;
#endif
    
#ifdef MODEL_VERTEX_TANGENT
    v_tangent = a_tangent;
    v_tangent = rot * v_tangent;
    vec3 worldTangent = a_tangent.xyz;
    vec3 worldBiTangent = cross(v_normal, worldTangent);// * sign(a_tangent.w);
    v_tangentToWorld = mat3(normalize(worldTangent), normalize(worldBiTangent), normalize(v_normal));
#endif

    gl_Position = u_modelViewProjectionMatrix * v_position;
}
