/**
 * Capitalize the first letter of a string.
 *
 * @param str String to capitalize
 * @returns
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate a string to a specified number of words, adding ellipsis if truncated.
 *
 * @param str String to truncate
 * @param wordCount
 * @returns
 */
export const truncateWords = (str: string, wordCount: number): string => {
  if (!str) return '';
  const words = str.split(' ');
  if (words.length <= wordCount) return str;
  return words.slice(0, wordCount).join(' ') + '...';
};