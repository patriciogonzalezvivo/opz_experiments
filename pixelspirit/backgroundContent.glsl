uniform float u_background;

#ifndef FNC_BACKGROUNDCONTENT
#define FNC_BACKGROUNDCONTENT

#include "glslLib/generative/random.glsl"

float dist (vec2 st) {
    // return length(st);
    // return min(abs(st.x+st.y),abs(st.x-st.y))+0.001;
    // return abs(st.x+st.y);
    return abs(st.x)+abs(st.y);
    // return abs(st.x);
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
}

vec3 backgroundContent(vec2 st) {
    vec3 color = vec3(0.0);

    if (u_background >= 1.0) {
        st = ratio(st, u_resolution);

        st = st.yx;
        vec2 grid = vec2(100.0);

        float rInv = 1.;

        #ifdef BACKGROUND_MOVEFF
        float t = u_clock*0.5;
        #else
        float t = -u_clock*0.5;
        #endif

        #ifdef BACKGROUND_ROTATE
        st = rotate(st, t * 0.25);
        #endif

        if (u_background >= 2.0) {
            st -= 0.5;

            if (u_background == 2.0) {
                rInv /= abs(st.x);
            }
            else if (u_background == 3.0) {
                rInv /= abs(st.x)+abs(st.y);
            }
            else if (u_background == 4.0) {
                rInv /= abs(st.x+st.y);
            }
            else if (u_background == 5.0) {
                rInv /= min(abs(st.x+st.y),abs(st.x-st.y))+0.001;
            }
            st = st * rInv - vec2(rInv,0.0);
            rInv *= 0.180;
            grid = vec2(30.0);
        }

        st *= grid;

        vec2 ipos = floor(st);  // integer
        vec2 fpos = fract(st);  // fraction

        vec2 vel = vec2(t*max(grid.x,grid.y)); // time
        vel *= vec2(-1.,0.0) * random(1.0+ipos.y); // direction

        // Assign a random value base on the integer coord
        vec2 offset = vec2(0.1,0.);

        float pct = 1.5 - max(u_kick, max(u_lead, max(u_arp, u_chord)));
        // color += pattern(st+offset,vel,pct);;
        color.r = pattern(st+offset,vel,0.5+pct);
        color.g = pattern(st,vel,0.5+pct);
        color.b = pattern(st-offset,vel,0.5+pct);

        // Margins
        color *= step(0.2 + u_chord,fpos.y);

        if (u_background >= 2.0) {
            color *= smoothstep(0.408,0.816,1.-rInv);
        }
    }

    // else if (u_background == 3.0) {
    //     st = ratio(st, u_resolution);
    //     // st = rotate(st, -u_clock * 0.5);
    //     st -= .5;

    //     float rInv = 1./dist(st);
    //     vec2 pos = st * rInv - vec2(rInv,0.0);
    //     rInv *= 0.180;

    //     float t = u_clock;
    //     pos *= vec2(30.0);

    //     vec2 ipos = floor(pos);
    //     vec2 fpos = fract(pos);
    //     float seed = random(ipos.y);
    //     float vel = t*20.;
    //     vel *= -.5 * seed - .5;
        
    //     float amount = 1.5 - u_lead;//abs(sin(t*0.1))*.45;
    //     float margin = 0.15 - u_chord;// + u_perc;

    //     float pct = pattern(pos, vec2(vel-0.15), amount);
        
    //     color += pct;// * step(margin,fpos.y) * step(margin,1.-fpos.y) * smoothstep(0.408,0.816,1.-rInv);
    //     color *= step(margin, fpos.y);
    //     color *= smoothstep(0.408,0.816,1.-rInv);
    // }


    return color; 
}

#endif