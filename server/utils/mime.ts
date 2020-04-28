import fs from "fs"
import path from "path"

const mimetypes = fs.readFileSync(
  path.join(__dirname, "mimetypes.json"), 
  "utf8",
)

export default (extension: string): string => mimetypes[extension]
