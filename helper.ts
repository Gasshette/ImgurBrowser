export class Helper {
  /**
   * Return true if the compared stirng is inside the comparer
   * @param compared The string to compare (compare = is inside the array)
   * @param comparer The array of string
   */
  public testString = (compared: Array<string>, comparer: Array<string>) => {
    const regex = new RegExp(compared.join('|'), 'i');
    return regex.test(comparer.join('|'));
  }
}