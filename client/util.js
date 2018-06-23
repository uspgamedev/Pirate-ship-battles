const ISOMETRIC = true;
const ISO_ANGLE = (ISOMETRIC)? 0.61540852 /* 35.2603 degrees */ : Math.PI/2;
const ISO_SIN = Math.sin(ISO_ANGLE);
const ISO_COS = Math.cos(ISO_ANGLE);

function toIsometric(y, z=0) {
    return ISO_SIN*y - ISO_COS*(z - 1/ISO_SIN)
}

function fmod(num, mod) {
	r = num%mod;
	return (r < 0)? r + mod : r;
}
