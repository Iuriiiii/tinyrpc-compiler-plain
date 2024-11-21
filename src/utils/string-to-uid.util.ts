export function stringToUID(text: string) {
  let uid = 0;

  for (let i = 0; i < text.length; i++) {
    if (i % 2 === 0) {
      uid += text.charCodeAt(i);
    } else {
      uid += uid / text.charCodeAt(i);
    }
  }

  return uid;
}
