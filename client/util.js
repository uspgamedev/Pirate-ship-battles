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

function normSq(x, y) {
    return x*x + y*y;
}

function norm(x, y) {
    return Math.sqrt(x*x + y*y);
}

function argMax(array, avalFunc=((x) => x)) {
    return array.map((x, i) => [avalFunc(x), x]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function clampRad(x, y, rad) {
    if (rad == 0)
        return [0, 0];
    let dist = norm(x, y);
    if (dist > rad) {
        let ratio = rad/dist;
        return [x*ratio, y*ratio];
    }
    return [x, y];
}

function clampRect(x, y, r) {
    return [Math.max(Math.min(x, r.x + r.w), r.x),
            Math.max(Math.min(y, r.y + r.h), r.y)];
}

function mapFloatToInt(v, fmin, fmax, imin, imax) {
    return Math.floor((v - fmin)*(imax - imin)/(fmax - fmin) + imin);
}
