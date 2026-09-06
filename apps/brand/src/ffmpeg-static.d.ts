declare module 'ffmpeg-static' {
  /** Absolute path to the bundled ffmpeg binary, null when unsupported. */
  const path: string | null;
  export default path;
}
