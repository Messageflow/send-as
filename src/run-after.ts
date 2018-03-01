// @ts-check

export async function runAfter(
  after: number = 5e2
) {
  if (Number.isNaN(+after)) {
    throw new TypeError('Param after is not a number');
  }

  return new Promise(yay => setTimeout(yay, after));
}

export default runAfter;
