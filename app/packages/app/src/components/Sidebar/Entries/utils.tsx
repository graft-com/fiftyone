import {
  EMBEDDED_DOCUMENT_FIELD,
  LABELS_PATH,
  LABEL_DOC_TYPES,
  withPath,
} from "@fiftyone/utilities";

export const MATCH_LABEL_TAGS = {
  path: "tags",
  ftype: EMBEDDED_DOCUMENT_FIELD,
  embeddedDocType: withPath(LABELS_PATH, LABEL_DOC_TYPES),
};

const RESERVED_GROUPS = new Set([
  "frame tags",
  "label tags",
  "other",
  "patch tags",
  "sample tags",
  "tags",
]);

export const validateGroupName = (name: string): boolean => {
  if (RESERVED_GROUPS.has(name)) {
    alert(`${name.toUpperCase()} is a reserved group`);
    return false;
  }
  return true;
};
