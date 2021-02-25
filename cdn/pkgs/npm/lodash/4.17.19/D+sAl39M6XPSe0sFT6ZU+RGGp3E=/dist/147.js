function basePropertyOf(object) {
  return function (key) {
    return object == null ? undefined : object[key];
  };
}
export { basePropertyOf as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyuYmFzZVByb3BlcnR5T2YFwMCXl6FvAAABwJDAl6FvAAACBJDAmaFkAGADwJEDwMKZoWyuYmFzZVByb3BlcnR5T2aSAwbAwMDAkNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlUHJvcGVydHlPZi5qc5ihcgkOwMCRAsDCmKFnAQMFwJDAwpihZwkLBsCRBsDCmKFyAA7AwJECwMI=
====catalogjs annotation end====*/