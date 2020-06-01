// The purpose of a CodeRegion is to mark a region of source code that we may be
// able to remove or replace. CodeRegions form a hierarchy, and by convention if
// all the child regions of a region are removed, the region itself must be
// removed.
export interface CodeRegion {
  // these are character offsets relative to our parent's start. The topmost
  // Coderegion has no parent, so its start and end encompass the whole module,
  // so start always equals 0 and end always equal module length.
  start: number;
  end: number;

  parent?: CodeRegion;
  children?: CodeRegion[];
}

export interface IdentifierRegion extends CodeRegion {
  // when we want to rewrite regions containing identifiers, we need to be aware
  // if they represent object or import shorthand syntax, so that we can
  // rewrite:
  //
  //    let { x } = foo();
  //
  // to:
  //
  //    let { x: x0 } = foo();
  //
  // "as" means we're in an import or export context, ":" means object
  // shorthand, false is a plain identifier with no shorthand.
  shorthand: "as" | ":" | false;
}
