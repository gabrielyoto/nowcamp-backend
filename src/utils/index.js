module.exports = {
  format(rawDate, time = false) {
    if (rawDate === null) return null
    const formatted = new Date(rawDate)
    const date = typeof rawDate === "string"
      ? new Date(
        `${formatted.getUTCMonth() + 1}-${formatted.getUTCDate()}-${
          formatted.getUTCFullYear()}`
      )
      :  rawDate
    if (!time) return date.toLocaleDateString()
    return date.toLocaleString()
  }
}