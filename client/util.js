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

function sign(num) {
    return ((num < 0)? -1 : ((num > 0)? 1 : 0));
}

function clampRad(x, y, rad) {
    if (rad == 0)
        return [0, 0];
    let dist = Math.sqrt(x*x + y*y);
    if (dist > rad) {
        let mod = rad/dist;
        return [x*mod, y*mod];
    }
    return [x, y];
}
