#ifndef HEADER_OPZ
#define HEADER_OPZ
uniform float       u_clock;
uniform float       u_kick;
uniform float       u_snare;
uniform float       u_perc;
uniform float       u_sample;
uniform float       u_bass;
uniform float       u_lead;
uniform float       u_arp;
uniform float       u_chord;

#define OPZ_GREY vec3(0.815686275)
#define OPZ_GREEN vec3(0.003921569, 0.345098039, 0.184313725)
#define OPZ_BLUE vec3(0.094117647, 0.364705882, 0.51372549)
#define OPZ_YELLOW vec3(0.949019608, 0.623529412, 0.019607843)
#define OPZ_RED vec3(0.819607843, 0.11372549, 0.196078431)

#endif

#ifndef FNC_GETOPZCHANNEL
#define FNC_GETOPZCHANNEL
float getOpzChannel(int channel) {
    #ifdef PLATFORM_RPI
    if (channel == 0)
        return u_kick;
    else if (channel == 1)
        return u_snare;
    else if (channel == 2)
        return u_perc;
    else if (channel == 3)
        return u_sample;
    else if (channel == 4)
        return u_bass;
    else if (channel == 5)
        return u_lead;
    else if (channel == 6)
        return u_arp;
    else if (channel == 7)
        return u_chord;
    return 0.0;

    #else
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
    #endif
}
#endif