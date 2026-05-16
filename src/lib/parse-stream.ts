export type SectionCallback = (section: string, content: string, isDone: boolean) => void

/**
 * Parses streamed Claude output that uses XML-style section markers:
 *   <SECTION:name>...content...</SECTION:name>
 *
 * Handles markers split across chunk boundaries by keeping a tail buffer.
 */
export class StreamSectionParser {
  private buffer = ''
  private currentSection: string | null = null
  private sectionContent = ''

  constructor(private onSection: SectionCallback) {}

  feed(chunk: string): void {
    this.buffer += chunk

    while (true) {
      if (this.currentSection === null) {
        const openMatch = this.buffer.match(/<SECTION:([a-z0-9_]+)>/)
        if (!openMatch || openMatch.index === undefined) break

        this.currentSection = openMatch[1]
        this.sectionContent = ''
        this.buffer = this.buffer.slice(openMatch.index + openMatch[0].length)
      } else {
        const closeTag = `</SECTION:${this.currentSection}>`
        const closeIdx = this.buffer.indexOf(closeTag)

        if (closeIdx !== -1) {
          this.sectionContent += this.buffer.slice(0, closeIdx)
          this.onSection(this.currentSection, this.sectionContent.trim(), true)
          this.buffer = this.buffer.slice(closeIdx + closeTag.length)
          this.currentSection = null
          this.sectionContent = ''
        } else {
          // Keep a tail in the buffer in case the close tag is split across chunks
          const safeLen = Math.max(0, this.buffer.length - closeTag.length)
          if (safeLen > 0) {
            const partial = this.buffer.slice(0, safeLen)
            this.sectionContent += partial
            this.onSection(this.currentSection, this.sectionContent, false)
            this.buffer = this.buffer.slice(safeLen)
          }
          break
        }
      }
    }
  }

  flush(): void {
    if (this.currentSection && this.buffer.length > 0) {
      this.sectionContent += this.buffer
      this.onSection(this.currentSection, this.sectionContent.trim(), true)
    }
  }
}
