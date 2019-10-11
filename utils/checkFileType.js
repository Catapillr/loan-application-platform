import * as R from "ramda"

export default acceptedFileTypes => ({ type }) => {
  const checkFileType = R.map(R.equals)(acceptedFileTypes)
  return R.anyPass(checkFileType)(type)
}
