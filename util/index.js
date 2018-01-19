module.exports.getArgs = msg => {
  const content = msg.content;
  const matches = content.match(/^!(?:\S*?)\s(.*?)$/);
  if (matches && matches.length >= 2) {
    return matches[1];
  } 
  return null;
}