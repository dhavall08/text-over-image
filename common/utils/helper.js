export const appName = 'text_over_image';
export const baseTitle = 'Text over Image';

export const PER_PAGE = 12;

export function getTitle(pageName) {
  return `${pageName} | ${baseTitle}`;
}

export function insertAtCursor(field, myValue, position) {
  let newStrValue;
  // IE support
  if (document.selection) {
    field.focus();
    sel = document.selection.createRange();
    sel.text = myValue;
  }
  // Mozilla and others
  else if (field.selectionStart || field.selectionStart === 0) {
    const startPos = position ?? field.selectionStart;
    const endPos = position ?? field.selectionEnd;
    newStrValue =
      field.value.substring(0, startPos) +
      myValue +
      field.value.substring(endPos, field.value.length);
  } else {
    newStrValue = field.value + myValue;
  }

  return {
    newStrValue,
    newPosition: (position || field?.selectionStart || 0) + myValue.length,
  };
}
