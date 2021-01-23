uniform float       u_postprocessing;

#ifndef FNC_POSTPROCESSING
#define FNC_POSTPROCESSING

vec3 postprocessing(vec2 st) {
    vec3 color = vec3(0.0);

    if (u_postprocessing == 1.0) {
        st.x = abs(st.x - .5) + 0.5;
        color = texture2D(u_scene, st).rgb;
    }

    else 
    {
        color = texture2D(u_scene, st).rgb;
    }
    
    return color; 
}

#endif