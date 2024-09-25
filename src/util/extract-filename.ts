export function extractFilename(url: string): string | undefined {
  const filenameRegex = /\/([^\/]+)\.[^\.]+\?/;
  const match = url.match(filenameRegex);

  if (match && match[1]) {
    let filename = match[1];
    return filename.replace(/[^a-zA-Z0-9]/g, "_");
  }
}
