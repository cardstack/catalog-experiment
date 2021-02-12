function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}
export { overArg as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWynb3ZlckFyZwXAwJeXoW8AAAHAkMCXoW8AAAIEkMCZoWQAVQPAkQPAwpmhbKdvdmVyQXJnkgMGwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fb3ZlckFyZy5qc5ihcgkHwMCRAsDCmKFnAQMFwJDAwpihZwkLBsCRBsDCmKFyAAfAwJECwMI=
====catalogjs annotation end====*/