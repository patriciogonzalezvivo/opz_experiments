#ifndef FNC_CARDCONTENT
#define FNC_CARDCONTENT

#include "glslLib/math/const.glsl"
#include "glslLib/math/saturate.glsl"

#include "glslLib/space/ratio.glsl"
#include "glslLib/space/scale.glsl"
#include "glslLib/space/rotate.glsl"

#define AA_EDGE .0002

#include "glslLib/draw/fill.glsl"
#include "glslLib/draw/stroke.glsl"
#include "glslLib/draw/flip.glsl"
#include "glslLib/draw/bridge.glsl"

#include "glslLib/draw/rectSDF.glsl"
#include "glslLib/draw/circleSDF.glsl"
#include "glslLib/draw/crossSDF.glsl"
#include "glslLib/draw/vesicaSDF.glsl"
#include "glslLib/draw/triSDF.glsl"
#include "glslLib/draw/rhombSDF.glsl"
#include "glslLib/draw/polySDF.glsl"
#include "glslLib/draw/raysSDF.glsl"
#include "glslLib/draw/starSDF.glsl"
#include "glslLib/draw/heartSDF.glsl"
#include "glslLib/draw/flowerSDF.glsl"
#include "glslLib/draw/spiralSDF.glsl"

uniform float u_card;

#ifdef MATERIAL_NAME_FRONT
void cardContent(inout vec3 color) {
    vec2 st = v_texcoord.xy;

    float rect = rectSDF(st + vec2(0.0, 0.03), vec2(1.));
    float mask = step(rect, .83);
    color *= step(.75, rect);

    st.y = 1.0 - st.y;
    st = scale(st, 1.31);
    st = ratio(st, vec2(448.0, 748.0));

    if (u_card == 0.0) {
        // ELEMENTS LOGO
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);

        value += stroke(circleSDF(st),.9,.1 + u_kick * 0.1);
        value += fill(flowerSDF(st.yx,3), .2);
        value -= fill(triSDF(vec2(st.x,.98-st.y)), .15);

        color += saturate(value) * mask;
    }

    else if (u_card == 1.0) {
        // JUSTICE
        st = rotate(st, -u_clock * 0.5);
        color += step(.5,st.x) * mask;
    }

    else if (u_card == 2.0) {
        // STRENGTH
        st = rotate(st, -u_clock * 0.5);
        color += step(.5+cos(st.y * PI)*.25, st.x) * mask;
    }

    else if (u_card == 3.0) {
        // THE WALL
        st = rotate(st, -u_clock * 0.5);
        color += stroke(st.x, .5, .1 + u_kick * 0.1) * mask;
    }

    else if (u_card == 4.0) {
        // TEMPLANCE
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);
        float offset = cos(st.y*PI)*.15;
        value += stroke(st.x,.28+offset,.1 + u_kick * 0.05);
        value += stroke(st.x,.5+offset,.1 + u_kick * 0.05);
        value += stroke(st.x,.72+offset,.1 + u_kick * 0.05);
        color += value * mask;
    }

    else if (u_card == 5.0) {
        // THE HANGED MAN
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);
        float sdf = .5+(st.x-st.y)*.5;
        value += stroke(sdf,.5,.05 + u_kick * 0.05);

        float sdf_inv = (st.x+st.y)*.5;
        value += stroke(sdf_inv,.5,.05 + u_kick * 0.05);
        color += value * mask;
    }

    else if (u_card == 6.0) {
        // THE MOON
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);
        value += fill(circleSDF(st),.65);
        vec2 offset = vec2(.1,.05);
        value -= fill(circleSDF(st-offset),.5 + u_kick * 0.05);
        color += saturate(value) * mask;
    }

    else if (u_card == 7.0) {
        // THE EMPERATOR
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);
        float sdf = rectSDF(st, vec2(1.));
        value += stroke(sdf,.5,.125 + u_kick * 0.05);
        value += fill(sdf,.1);
        color += saturate(value) * mask;
    }

    else if (u_card == 8.0) {
        // THE TOWER
        float value = 0.0;
        // st = rotate(st, -u_clock * 0.5);
        vec2 st2 = rotate(st, -u_clock * 0.5);
        float rect2 = rectSDF(st, vec2(.5,1.));
        float diag = (st2.x+st2.y)*.5;
        value += flip(fill(rect2,.6 + u_kick * 0.05 ),
                stroke(diag, .5, .01));
        color += saturate(value) * mask;
    }

    else if (u_card == 9.0) {
        // THE MERGE
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);
        vec2 offset = vec2(.15,.0);
        float left = circleSDF(st+offset);
        float right = circleSDF(st-offset);
        value += flip(  stroke(left,.5,.05 + u_kick * 0.05),
                        fill(right,.525 - u_kick * 0.05));
        color += saturate(value) * mask;
    }

    else if (u_card == 10.0) {
        // HOPE
        float value = 0.0;
        // st = rotate(st, -u_clock * 0.5);
        vec2 st2 = rotate(st, -u_clock * 0.5);
        float sdf = vesicaSDF(st,.2);
        value += flip(  fill(sdf,.5 + u_kick * 0.05),
                        step((st2.x+st2.y)*.5,.5));
        color += saturate(value) * mask;
    }

    else if (u_card == 11.0) {
        // THE TEMPLE
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);
        st.y -= 0.11;
        vec2 ts = vec2(st.x,.82-st.y);
        value += fill(triSDF(st),.7);
        value -= fill(triSDF(ts),.36+ u_kick * 0.05);
        color += saturate(value) * mask;
    }

    else if (u_card == 12.0) {
        // SUMMIT
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);
        st.y += 0.1;
        float circle = circleSDF(st-vec2(.0,.1));
        float triangle = triSDF(st+vec2(.0,.1));
        value += stroke(circle,.45,.1 + u_kick * 0.1);
        value *= step(.55,triangle);
        value += fill(triangle,.45);
        color += saturate(value) * mask;
    }

    else if (u_card == 13.0) {
        // THE HERMIT
        float value = 0.0;
        value +=    flip(fill(triSDF(st),.5 + u_kick * 0.05),
                    fill(rhombSDF( scale(st,1./vec2( cos(u_clock), 1.)) ),.4));
        color += saturate(value) * mask;
    }

    else if (u_card == 14.0) {
        // THE STONE
        float value = 0.0;
        st = rotate(st,radians(-45.));
        st = rotate(st, -u_clock * 0.5);
        value += fill(rectSDF(st,vec2(1.)),.4);
        value *= 1.-stroke(st.x,.5,.02 + u_kick * 0.01);
        value *= 1.-stroke(st.y,.5,.02 + u_kick * 0.01);
        color += saturate(value) * mask;
    }

    else if (u_card == 15.0) {
        // MOUNTAINS
        float value = 0.0;
        // st = rotate(st, -u_clock * 0.5);
        st = rotate(st,radians(-45.));
        float off = .12;
        vec2 s = vec2(1.);
        value += fill(rectSDF(st+off,s),.2 + u_kick * 0.01);
        value += fill(rectSDF(st-off,s),.2 + u_kick * 0.01);
        float r = rectSDF(st,s);
        value *= step(.33 + u_kick * 0.025,r);
        value += fill(r,.3 + u_kick * 0.025);
        color += saturate(value) * mask;
    }

    else if (u_card == 16.0) {
        // THE SHADOW
        float value = 0.0;
        st = rotate(vec2(st.x,1.0-st.y),
                    radians(45.));
        // st = rotate(st, -u_clock * 0.5);
        vec2 s = vec2(1.);
        float o = 0.1 * (sin(u_kick) * 0.5 + 0.5);
        value += fill(rectSDF( rotate(st-o,u_clock * 0.5) ,s),.4);

        float r = rectSDF( rotate(st+o, u_clock * 0.5),s);
        value += fill(r,.4);
        value *= step(.38,r);
        color += saturate(value) * mask;
    }

    else if (u_card == 17.0) {
        // THE EMPERATRIS
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);
        float d1 = polySDF(st,5);
        vec2 ts = vec2(st.x,1.-st.y);
        float d2 = polySDF(ts,5);
        value += fill(d1,.75) *
                fill(fract(d1*5.),.5 + u_kick * 0.05);
        value -= fill(d1,.6) *
                fill(fract(d2*4.9),.45);
        
        color += saturate(value) * mask;
    }

    else if (u_card == 18.0) {
        // THE STAR
        float value = 0.0;
        st = rotate(st, u_clock * 0.1);
        value += stroke(raysSDF(rotate(st, -u_clock * 0.35),8),.5,.15 + u_kick * 0.025);
        float inner = starSDF(st.xy, 6, .09);
        float outer = starSDF(st.yx, 6, .09);
        value *= step(.7,outer);
        value += fill(outer, .5);
        value -= stroke(inner, .25, .06);
        value += stroke(outer, .6, .05);
        
        color += saturate(value) * mask;
    }

    else if (u_card == 19.0) {
        // THE JUDMENT
        float value = 0.0;
        value += flip(stroke( raysSDF(rotate(st, -u_clock * 0.25),28),.5,.2),
                fill(st.y,.5));
        float rect = rectSDF(st, vec2(1.));
        value *= step(.25 + u_kick * 0.025,rect);
        value += fill(rect,.2+ u_kick * 0.025);
        
        color += saturate(value) * mask;
    }

    else if (u_card == 20.0) {
        // VISION
        float value = 0.0;
        float v1 = vesicaSDF(st,.5);
        vec2 st2 = st.yx+vec2(.04,.0);
        float v2 = vesicaSDF(st2,.7);
        value += stroke(v2,1.,.05);
        value += fill(v2,1.)*
                stroke(circleSDF(st),.3,.05 + u_kick * 0.025);
        value += fill(raysSDF(rotate(st, -u_clock * 0.125),50),.2)*
                fill(v1,1.25)*
                step(1.,v2);
        
        color += saturate(value) * mask;
    }

    else if (u_card == 21.0) {
        // The Lovers
        float value = 0.0;
        // st = rotate(st, -u_clock * 0.5);
        value += fill(heartSDF(st),.5 + u_kick * 0.1);
        value -= stroke(polySDF(st,3),.15,.05);
        
        color += saturate(value) * mask;
    }

    else if (u_card == 22.0) {
        // THE MAGICIAN
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);
        st.x = flip(st.x,step(.5,st.y));
        vec2 offset = vec2(.15,.0);
        float left = circleSDF(st+offset);
        float right = circleSDF(st-offset);
        value += stroke(left, .4, .075 + u_kick * 0.025);
        value = bridge(value, right, .4,.075 + u_kick * 0.025);
        
        color += saturate(value) * mask;
    }

    else if (u_card == 23.0) {
        // THE CHARRIOT
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);

        float r1 = rectSDF(st, vec2(1.));
        float r2 = rectSDF(rotate(st,radians(45.)), 
                        vec2(1.));
        float inv = step(.5,(st.x+st.y)*.5);
        inv = flip(inv,step(.5,.5+(st.x-st.y)*.5));
        float w = .075 + u_kick * 0.025;
        value += stroke(r1,.5,w) + stroke(r2,.5,w);
        float bridges = mix(r1,r2,inv);
        value = bridge(value, bridges, .5, w);
                
        color += saturate(value) * mask;
    }

    else if (u_card == 24.0) {
        // TURNING POINT
        float value = 0.0;
        st = scale(st, 2.);
        st = rotate(st, -u_clock * 0.5);

        // st = rotate(st, radians(-60.));
        st.y = flip(st.y,step(.5,st.x));
        st.y += .25;
        float down = polySDF(st,3);
        st.y = 1.5-st.y;
        float top = polySDF(st,3);
        value += stroke(top,.4,.15 + u_kick * 0.05);
        value = bridge(value,down,.4,.15 + u_kick * 0.05);
                
        color += saturate(value) * mask;
    }

    else if (u_card == 25.0) {
        // Gather
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);

        float n = 12.;
        float a = TAU/n;
        for (float i = 0.; i < n; i++) {
            vec2 xy = rotate(st,a*i);
            xy.y -= .189;
            float vsc = vesicaSDF(xy,.3);
            value *= 1.-stroke(vsc,.45,0.1 + u_kick * 0.01)*
                    step(.5,xy.y);
            value += stroke(vsc,.45,0.05 + u_kick * 0.01);
        }
                
        color += saturate(value) * mask;
    }

    else if (u_card == 26.0) {
        // THE ELDER
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);

        float n = 3.;
        float a = TAU/n;
        float v = 0.1 + u_kick * 0.025;
        for (float i = 0.; i < n*2.; i++) {
            vec2 xy = rotate(st,a*i);
            xy.y -= .09;
            float vsc = vesicaSDF(xy,.3);
            value = mix(value + stroke(vsc,.5,v),
                        mix(value,
                            bridge(value, vsc,.5,v),
                            step(xy.x,.5)-step(xy.y,.4)),
                        step(3.,i));
        }
                
        color += saturate(value) * mask;
    }

    else if (u_card == 27.0) {
        // INNER TRUTH
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);

        st -= .5;
        float r = dot(st,st);
        float a = (atan(st.y,st.x)/PI);
        vec2 uv = vec2(a,r);
        vec2 grid = vec2(5.,log(r)*20.); 
        vec2 uv_i = floor(uv*grid);
        uv.x += .5*mod(uv_i.y,2.);
        vec2 uv_f = fract(uv*grid);
        float shape = rhombSDF(uv_f);
        value += fill(shape,.9 + u_kick * 0.1)*
                step(.75, 1.-r);
                
        color += saturate(value) * mask;
    }

    else if (u_card == 28.0) {
        // THE WORLD
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);

        value += fill(flowerSDF(st,5),.25);
        value -= step(.95,starSDF(rotate(st,0.628),5,.1));
        value = clamp(value,0.,1.);
        float circle = circleSDF(st);
        value -= stroke(circle,.1,.05);
        value += stroke(circle,.8,.07+ u_kick * 0.025);
                
        color += saturate(value) * mask;
    }

    else if (u_card == 29.0) {
        // The World
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);

        value += step(.5,spiralSDF(st,.13));
                
        color += saturate(value) * mask;
    }

    else if (u_card == 30.0) {
        // The World
        float value = 0.0;
        st = rotate(st, -u_clock * 0.5);

        value += stroke( circleSDF(st), 0.55, .5 );
        value *= 1.0-stroke( st.x, 0.5, 0.025);
        value += fill(crossSDF(st, 0.75), .25);
                
        color += saturate(value) * mask;
    }
}
#endif

#endif