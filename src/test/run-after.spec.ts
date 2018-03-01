// @ts-check

/** Import other modules */
import runAfter from '../run-after';

describe('run-after', () => {
  test('after is not a number', async () => {
    try {
      await runAfter(NaN);
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toBe('Param after is not a number');
    }
  });

  test('runAfter works', async () => {
    try {
      const cachedTimeout = global.setTimeout;

      /** NOTE: Mock setTimeout */
      global.setTimeout = jest.fn(cb => cb());

      await runAfter();

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5e2);

      /** NOTE: Restore setTimeout */
      global.setTimeout = cachedTimeout;
    } catch (e) {
      throw e;
    }
  });

  test('runAfter works with custom timeout', async () => {
    try {
      const cachedTimeout = global.setTimeout;

      /** NOTE: Mock setTimeout */
      global.setTimeout = jest.fn(cb => cb());

      await runAfter(599e3);

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 599e3);

      /** NOTE: Restore setTimeout */
      global.setTimeout = cachedTimeout;
    } catch (e) {
      throw e;
    }
  });

});
