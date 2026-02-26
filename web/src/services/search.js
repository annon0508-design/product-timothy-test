export function searchKeywords(segments, keywords) {
  const results = [];

  if (!segments || !keywords) {
    return results;
  }

  segments.forEach((seg) => {
    keywords.forEach((kw) => {
      if (seg.text && seg.text.includes(kw)) {
        results.push({
          keyword: kw,
          text: seg.text,
          start: seg.start, 
        });
      }
    });
  });

  return results;
}