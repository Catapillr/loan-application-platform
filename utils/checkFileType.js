import * as R from "ramda"

export default acceptedFileTypes => value => {
  if (!value) return true
  const checkFileType = R.map(R.equals)(acceptedFileTypes)
  return R.anyPass(checkFileType)(value.type)
}
